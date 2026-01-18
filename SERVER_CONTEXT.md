# Meme Academy Server - Context for Separate Repository

Copy this to `CLAUDE.md` in your server repository.

---

# Meme Academy Server

## Overview
Socket.io game server for the Meme Academy multiplayer party game. Handles room management, game state, and real-time communication.

## Tech Stack
- Node.js, Express, Socket.io, TypeScript

## Project Structure

```
src/
├── index.ts        # Express + Socket.io setup, event handlers
├── GameRoom.ts     # GameRoomManager class (all game logic)
├── types.ts        # Server-side types
└── content/        # Meme and phrase data pools (if not fetched from API)
```

## Game Flow & Phases

```
lobby → phrase_selection → picking → judging → result → phrase_selection → ...
```

| Phase | Who acts | Next phase trigger |
|-------|----------|-------------------|
| `lobby` | Host clicks start | `start_game` event → random player becomes judge |
| `phrase_selection` | Judge picks phrase (3-slide carousel UI) | `select_phrase` event |
| `picking` | All non-judges submit | All players submitted |
| `judging` | Judge picks winner | `select_winner` event |
| `result` | Winner clicks "Next Round" | `next_round` event → winner becomes next judge |

**Critical**:
- First judge is randomly selected when game starts
- Winner becomes the next judge (not the current judge)

## Socket Events

### Client → Server
```typescript
socket.on('create_room', ({ nickname }) => ...)
socket.on('join_room', ({ roomCode, nickname }) => ...)
socket.on('reconnect_room', ({ playerId, roomCode }) => ...)
socket.on('start_game', () => ...)
socket.on('select_phrase', ({ phraseId }) => ...)
socket.on('submit_meme', ({ memeId }) => ...)
socket.on('select_winner', ({ oderId }) => ...)
socket.on('next_round', () => ...)
```

### Server → Client
```typescript
socket.emit('room_created', { roomCode, playerId })
socket.emit('room_joined', { playerId })
socket.emit('room_state', { state: GameState })
socket.emit('hand_dealt', { hand: MemeCard[] })
socket.emit('player_joined', { player })
socket.emit('player_left', { playerId })
socket.emit('player_reconnected', { playerId })
socket.emit('phrase_selected', { phrase })
socket.emit('player_submitted', { playerId })
socket.emit('winner_selected', { winnerId, oderId })
socket.emit('new_round', { round })
socket.emit('error', { message })
```

## Types

```typescript
type GamePhase = 'lobby' | 'phrase_selection' | 'picking' | 'judging' | 'result';
type PlayerId = string;  // UUID
type RoomCode = string;  // 6 char alphanumeric

interface Player {
  id: PlayerId;
  nickname: string;
  avatarColor: string;
  score: number;
  isConnected: boolean;
  isHost: boolean;
}

interface ServerPlayer extends Player {
  socketId: string;
  hand: MemeCard[];
}

interface MemeCard {
  id: string;
  imageUrl: string;
}

interface Phrase {
  id: string;
  text: string;
}

interface ServerRoundState {
  roundNumber: number;
  judgeId: PlayerId;
  phraseOptions: Phrase[];           // 3 options for judge
  phrase: Phrase | null;             // null until judge selects
  submissions: Map<PlayerId, { memeId: string; meme: MemeCard }>;
  winnerId: PlayerId | null;
  winningMemeId: string | null;
}

interface ServerRoom {
  code: RoomCode;
  phase: GamePhase;
  players: Map<PlayerId, ServerPlayer>;
  hostId: PlayerId;
  currentRound: ServerRoundState | null;
  usedPhraseIds: string[];
  usedMemeIds: string[];
  createdAt: number;
}
```

## GameRoomManager Methods

```typescript
class GameRoomManager {
  // Room lifecycle
  createRoom(socket, nickname): void    // Creates room, player becomes host
  joinRoom(socket, roomCode, nickname): void
  reconnect(socket, playerId, roomCode): void
  handleDisconnect(socket): void        // Marks player disconnected, cleanup

  // Game actions (all validate caller + phase)
  startGame(socket): void               // Host only, phase: lobby
  selectPhrase(socket, phraseId): void  // Judge only, phase: phrase_selection
  submitMeme(socket, memeId): void      // Non-judge, phase: picking
  selectWinner(socket, oderId): void    // Judge only, phase: judging
  nextRound(socket): void               // Winner only, phase: result

  // Internal helpers
  private dealHands(room): void         // Give each player 10 memes
  private replenishHands(room): void    // Give 1 new meme to each who submitted
  private createRound(room, judgeId): ServerRoundState
}
```

## Key Logic Details

### Room Creation
- Generate 6-char room code
- First player is host
- Store socket → player mapping

### Start Game
- Validate: host only, min 3 players
- Deal hands (10 memes each, no duplicates)
- **Pick random first judge** (any player, including host)
- Create round with 3 phrase options (`phraseOptions`)
- **Phase → `phrase_selection`** (NOT `picking`!)
- Judge sees carousel, other players see waiting screen

### Phrase Selection
- Judge picks from `phraseOptions`
- Set `phrase`, mark as used
- Phase → `picking`

### Meme Submission
- Remove meme from player's hand
- Track in `submissions` Map
- When all non-judges submit → phase `judging`

### Winner Selection
- `oderId` format: `"order-X"` (shuffled index)
- Find actual player from submissions
- Award point to winner
- Phase → `result`

### Next Round
- Only **winner** can trigger (they become next judge)
- Replenish hands (1 card each)
- Create new round with 3 fresh phrases
- Phase → `phrase_selection`

## Public State Transformation

`toPublicState(room)` converts ServerRoom to client-safe state:
- Strips `socketId` and `hand` from players
- **Must include `phraseOptions`** in `currentRound` for phrase selection UI
- Only reveals submissions during `judging`/`result` phases
- Uses stored `shuffledSubmissionOrder` (do NOT shuffle on every call!)

## CRITICAL BUG FIX: Submission Shuffle Order

**Problem**: If you shuffle submissions in `toPublicState()` every time it's called, the `oderId` ("order-0", "order-1") will map to different players each time. When judge selects "order-0", a NEW shuffle happens and the wrong player wins!

**Fix**: Store shuffle order once when entering `judging` phase.

### 1. Update ServerRoundState type:
```typescript
interface ServerRoundState {
  roundNumber: number;
  judgeId: PlayerId;
  phraseOptions: Phrase[];
  phrase: Phrase | null;
  submissions: Map<PlayerId, { memeId: string; meme: MemeCard }>;
  shuffledSubmissionOrder: PlayerId[];  // ADD THIS - stores the shuffle order
  winnerId: PlayerId | null;
  winningMemeId: string | null;
}
```

### 2. Update submitMeme() - shuffle once when all submit:
```typescript
// When all non-judges submit, shuffle and store the order
if (room.currentRound.submissions.size === nonJudgePlayers.length) {
  // Shuffle ONCE and store the order
  const playerIds = Array.from(room.currentRound.submissions.keys());
  room.currentRound.shuffledSubmissionOrder = playerIds.sort(() => Math.random() - 0.5);

  room.phase = 'judging';
  this.io.to(room.code).emit('room_state', { state: toPublicState(room) });
}
```

### 3. Update toPublicState() - use stored order:
```typescript
// Only reveal submissions during judging or result phase
let revealedSubmissions: Submission[] = [];
if (room.phase === 'judging' || room.phase === 'result') {
  // Use the STORED shuffle order, don't re-shuffle!
  const order = room.currentRound.shuffledSubmissionOrder || [];

  revealedSubmissions = order.map((playerId, index) => {
    const sub = room.currentRound!.submissions.get(playerId)!;
    return {
      oderId: `order-${index}`,
      memeId: sub.memeId,
      meme: sub.meme,
    };
  });
}
```

### 4. Update selectWinner() - find by memeId directly:
```typescript
selectWinner(socket: Socket, oderId: string): void {
  // ... validation ...

  // Get the index from oderId
  const index = parseInt(oderId.replace('order-', ''), 10);
  const shuffledOrder = room.currentRound.shuffledSubmissionOrder;

  if (index < 0 || index >= shuffledOrder.length) {
    socket.emit('error', { message: 'Invalid selection' });
    return;
  }

  // Get the actual player ID from stored shuffle order
  const winnerId = shuffledOrder[index];
  const winningSubmission = room.currentRound.submissions.get(winnerId);

  if (!winnerId || !winningSubmission) {
    socket.emit('error', { message: 'Invalid selection' });
    return;
  }

  // Award point
  const winner = room.players.get(winnerId);
  if (winner) {
    winner.score += 1;
  }

  room.currentRound.winnerId = winnerId;
  room.currentRound.winningMemeId = winningSubmission.memeId;
  room.phase = 'result';

  this.io.to(room.code).emit('winner_selected', { winnerId, oderId });
  this.io.to(room.code).emit('room_state', { state: toPublicState(room) });
}
```

### 5. Update createRound() - initialize empty array:
```typescript
private createRound(room: ServerRoom, judgeId: PlayerId): ServerRoundState {
  const phraseOptions = getRandomPhrases(3, room.usedPhraseIds);

  return {
    roundNumber: (room.currentRound?.roundNumber ?? 0) + 1,
    judgeId,
    phraseOptions,
    phrase: null,
    submissions: new Map(),
    shuffledSubmissionOrder: [],  // ADD THIS
    winnerId: null,
    winningMemeId: null,
  };
}
```

## CORS Config
```typescript
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'your-production-url'],
    methods: ['GET', 'POST'],
  },
});
```

## Environment
```env
PORT=3001
```
