import { Server, Socket } from 'socket.io';
import { GAME_SETTINGS, PlayerId, ServerPlayer, ServerRoom, ServerRoundState, toPublicState } from './types';
import { GAME_CONFIG, generatePlayerId, generateRoomCode, getRandomAvatarColor } from './constants';
// import { ServerRoom, ServerPlayer, ServerRoundState, toPublicState } from './types';
// import { PlayerId, GAME_SETTINGS } from '../lib/game/types';
import { getRandomMemes } from './content/memes';
import { getRandomPhrase } from './content/phrases';
// import { generateRoomCode, generatePlayerId, getRandomAvatarColor, GAME_CONFIG } from '../lib/game/constants';

export class GameRoomManager {
  private rooms: Map<string, ServerRoom> = new Map();
  private socketToPlayer: Map<string, { roomCode: string; playerId: string }> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  createRoom(socket: Socket, nickname: string): void {
    const roomCode = generateRoomCode();
    const playerId = generatePlayerId();

    const player: ServerPlayer = {
      id: playerId,
      nickname,
      avatarColor: getRandomAvatarColor(),
      score: 0,
      isConnected: true,
      isHost: true,
      socketId: socket.id,
      hand: [],
    };

    const room: ServerRoom = {
      code: roomCode,
      phase: 'lobby',
      players: new Map([[playerId, player]]),
      hostId: playerId,
      currentRound: null,
      usedPhraseIds: [],
      usedMemeIds: [],
      createdAt: Date.now(),
    };

    this.rooms.set(roomCode, room);
    this.socketToPlayer.set(socket.id, { roomCode, playerId });

    socket.join(roomCode);

    socket.emit('room_created', { roomCode, playerId });
    socket.emit('room_state', { state: toPublicState(room) });
  }

  joinRoom(socket: Socket, roomCode: string, nickname: string): void {
    const room = this.rooms.get(roomCode.toUpperCase());

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.phase !== 'lobby') {
      socket.emit('error', { message: 'Game already in progress' });
      return;
    }

    if (room.players.size >= GAME_SETTINGS.maxPlayers) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    const playerId = generatePlayerId();

    const player: ServerPlayer = {
      id: playerId,
      nickname,
      avatarColor: getRandomAvatarColor(),
      score: 0,
      isConnected: true,
      isHost: false,
      socketId: socket.id,
      hand: [],
    };

    room.players.set(playerId, player);
    this.socketToPlayer.set(socket.id, { roomCode: room.code, playerId });

    socket.join(room.code);

    socket.emit('room_joined', { playerId });

    // Broadcast to all in room
    this.io.to(room.code).emit('room_state', { state: toPublicState(room) });
    this.io.to(room.code).emit('player_joined', {
      player: {
        id: player.id,
        nickname: player.nickname,
        avatarColor: player.avatarColor,
        score: player.score,
        isConnected: player.isConnected,
        isHost: player.isHost,
      },
    });
  }

  reconnect(socket: Socket, playerId: string, roomCode: string): void {
    const room = this.rooms.get(roomCode.toUpperCase());

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const player = room.players.get(playerId);

    if (!player) {
      socket.emit('error', { message: 'Player not found in room' });
      return;
    }

    // Update socket mapping
    player.socketId = socket.id;
    player.isConnected = true;
    this.socketToPlayer.set(socket.id, { roomCode: room.code, playerId });

    socket.join(room.code);

    socket.emit('room_joined', { playerId });
    socket.emit('room_state', { state: toPublicState(room) });

    // Send player's hand if game is in progress
    if (player.hand.length > 0) {
      socket.emit('hand_dealt', { hand: player.hand });
    }

    this.io.to(room.code).emit('player_reconnected', { playerId });
  }

  startGame(socket: Socket): void {
    const info = this.socketToPlayer.get(socket.id);
    if (!info) return;

    const room = this.rooms.get(info.roomCode);
    if (!room) return;

    const player = room.players.get(info.playerId);
    if (!player?.isHost) {
      socket.emit('error', { message: 'Only the host can start the game' });
      return;
    }

    if (room.players.size < GAME_SETTINGS.minPlayers) {
      socket.emit('error', { message: `Need at least ${GAME_SETTINGS.minPlayers} players` });
      return;
    }

    // Deal initial hands to all players
    this.dealHands(room);

    // Pick first judge (random)
    const playerIds = Array.from(room.players.keys());
    const judgeId = playerIds[Math.floor(Math.random() * playerIds.length)];

    // Start first round
    room.currentRound = this.createRound(room, judgeId);
    room.phase = 'picking';

    // Send state to all
    this.io.to(room.code).emit('room_state', { state: toPublicState(room) });

    // Send individual hands
    for (const [pid, p] of room.players) {
      const playerSocket = this.io.sockets.sockets.get(p.socketId);
      if (playerSocket) {
        playerSocket.emit('hand_dealt', { hand: p.hand });
      }
    }
  }

  submitMeme(socket: Socket, memeId: string): void {
    const info = this.socketToPlayer.get(socket.id);
    if (!info) return;

    const room = this.rooms.get(info.roomCode);
    if (!room || room.phase !== 'picking') return;

    const player = room.players.get(info.playerId);
    if (!player || !room.currentRound) return;

    // Judge cannot submit
    if (info.playerId === room.currentRound.judgeId) {
      socket.emit('error', { message: 'Judge cannot submit memes' });
      return;
    }

    // Check if already submitted
    if (room.currentRound.submissions.has(info.playerId)) {
      socket.emit('error', { message: 'Already submitted' });
      return;
    }

    // Find meme in player's hand
    const meme = player.hand.find(m => m.id === memeId);
    if (!meme) {
      socket.emit('error', { message: 'Meme not in your hand' });
      return;
    }

    // Record submission
    room.currentRound.submissions.set(info.playerId, { memeId, meme });

    // Remove from hand
    player.hand = player.hand.filter(m => m.id !== memeId);

    // Notify room
    this.io.to(room.code).emit('player_submitted', { playerId: info.playerId });

    // Check if all non-judge players submitted
    const nonJudgePlayers = Array.from(room.players.keys())
      .filter(id => id !== room.currentRound?.judgeId);

    if (room.currentRound.submissions.size === nonJudgePlayers.length) {
      room.phase = 'judging';
      this.io.to(room.code).emit('room_state', { state: toPublicState(room) });
    }
  }

  selectWinner(socket: Socket, oderId: string): void {
    const info = this.socketToPlayer.get(socket.id);
    if (!info) return;

    const room = this.rooms.get(info.roomCode);
    if (!room || room.phase !== 'judging') return;

    if (!room.currentRound || info.playerId !== room.currentRound.judgeId) {
      socket.emit('error', { message: 'Only the judge can select a winner' });
      return;
    }

    // Find the winning submission
    // oderId format is "order-X" where X is the index in shuffled array
    const publicState = toPublicState(room);
    const submission = publicState.currentRound?.revealedSubmissions.find(s => s.oderId === oderId);

    if (!submission) {
      socket.emit('error', { message: 'Invalid selection' });
      return;
    }

    // Find who submitted this meme
    let winnerId: PlayerId | null = null;
    for (const [playerId, sub] of room.currentRound.submissions) {
      if (sub.memeId === submission.memeId) {
        winnerId = playerId;
        break;
      }
    }

    if (!winnerId) return;

    // Update score
    const winner = room.players.get(winnerId);
    if (winner) {
      winner.score += 1;
    }

    room.currentRound.winnerId = winnerId;
    room.currentRound.winningMemeId = submission.memeId;
    room.phase = 'result';

    this.io.to(room.code).emit('winner_selected', { winnerId, oderId });
    this.io.to(room.code).emit('room_state', { state: toPublicState(room) });
  }

  nextRound(socket: Socket): void {
    const info = this.socketToPlayer.get(socket.id);
    if (!info) return;

    const room = this.rooms.get(info.roomCode);
    if (!room || room.phase !== 'result' || !room.currentRound) return;

    const winnerId = room.currentRound.winnerId;
    if (!winnerId) return;

    // Replenish hands (give each player who submitted a new card)
    this.replenishHands(room);

    // Winner becomes next judge
    room.currentRound = this.createRound(room, winnerId);
    room.phase = 'picking';

    // Send updated state
    this.io.to(room.code).emit('room_state', { state: toPublicState(room) });
    this.io.to(room.code).emit('new_round', { round: toPublicState(room).currentRound });

    // Send individual hands
    for (const [pid, p] of room.players) {
      const playerSocket = this.io.sockets.sockets.get(p.socketId);
      if (playerSocket) {
        playerSocket.emit('hand_dealt', { hand: p.hand });
      }
    }
  }

  handleDisconnect(socket: Socket): void {
    const info = this.socketToPlayer.get(socket.id);
    if (!info) return;

    const room = this.rooms.get(info.roomCode);
    if (!room) return;

    const player = room.players.get(info.playerId);
    if (!player) return;

    player.isConnected = false;
    this.socketToPlayer.delete(socket.id);

    this.io.to(room.code).emit('player_left', { playerId: info.playerId });

    // In lobby, remove player after grace period
    if (room.phase === 'lobby') {
      setTimeout(() => {
        const p = room.players.get(info.playerId);
        if (p && !p.isConnected) {
          room.players.delete(info.playerId);

          // If host left, assign new host
          if (info.playerId === room.hostId && room.players.size > 0) {
            const newHost = room.players.values().next().value;
            if (newHost) {
              newHost.isHost = true;
              room.hostId = newHost.id;
            }
          }

          // Delete room if empty
          if (room.players.size === 0) {
            this.rooms.delete(room.code);
          } else {
            this.io.to(room.code).emit('room_state', { state: toPublicState(room) });
          }
        }
      }, GAME_CONFIG.reconnectGracePeriodMs);
    }
  }

  private dealHands(room: ServerRoom): void {
    const allUsedMemeIds: string[] = [];

    for (const [playerId, player] of room.players) {
      const hand = getRandomMemes(GAME_SETTINGS.memesPerHand, allUsedMemeIds);
      player.hand = hand;
      hand.forEach(m => allUsedMemeIds.push(m.id));
    }

    room.usedMemeIds = allUsedMemeIds;
  }

  private replenishHands(room: ServerRoom): void {
    if (!room.currentRound) return;

    // Give each player who submitted a new card
    for (const playerId of room.currentRound.submissions.keys()) {
      const player = room.players.get(playerId);
      if (!player) continue;

      const newCard = getRandomMemes(1, room.usedMemeIds)[0];
      if (newCard) {
        player.hand.push(newCard);
        room.usedMemeIds.push(newCard.id);
      }
    }
  }

  private createRound(room: ServerRoom, judgeId: PlayerId): ServerRoundState {
    const phrase = getRandomPhrase(room.usedPhraseIds);
    room.usedPhraseIds.push(phrase.id);

    return {
      roundNumber: (room.currentRound?.roundNumber ?? 0) + 1,
      judgeId,
      phrase,
      submissions: new Map(),
      winnerId: null,
      winningMemeId: null,
    };
  }

  getRoomInfo(roomCode: string): { exists: boolean; playerCount?: number; phase?: string; canJoin?: boolean } {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) {
      return { exists: false };
    }
    return {
      exists: true,
      playerCount: room.players.size,
      phase: room.phase,
      canJoin: room.phase === 'lobby' && room.players.size < GAME_SETTINGS.maxPlayers,
    };
  }
}
