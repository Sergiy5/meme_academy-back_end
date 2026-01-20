import { Locale } from "./i18n";

// ============ ROOM & PLAYER TYPES ============

export type RoomCode = string; // 6 character alphanumeric

export type PlayerId = string; // UUID

export interface Player {
  id: PlayerId;
  nickname: string;
  avatarColor: string;
  score: number;
  isConnected: boolean;
  isHost: boolean;
  locale: Locale;
}

// ============ GAME STATE TYPES ============

export type GamePhase =
  | "lobby"
  | "picking"
  | "judging"
  | "result"
  | "phrase_selection";

export interface MemeCard {
  id: string;
  imageUrl: string;
}

export interface Phrase {
  id: string;
  text: string;
}

export interface Submission {
  oderId: string;
  memeId: string;
  meme: MemeCard;
}

export interface RoundState {
  roundNumber: number;
  judgeId: PlayerId;
  phrase: Phrase;
  submittedPlayerIds: PlayerId[];
  revealedSubmissions: Submission[];
  winnerId: PlayerId | null;
  winningMemeId: string | null;
}

export interface GameState {
  roomCode: RoomCode;
  phase: GamePhase;
  players: Player[];
  hostId: PlayerId;
  currentRound: RoundState | null;
}

// ============ CLIENT STATE ============

export interface ClientState {
  playerId: PlayerId | null;
  roomCode: RoomCode | null;
  connectionStatus:
    | "connecting"
    | "connected"
    | "disconnected"
    | "reconnecting";
  gameState: GameState | null;
  myHand: MemeCard[];
  selectedMemeId: string | null;
  hasSubmitted: boolean;
  error: string | null;
  isLoading: boolean;
}

// ============ SOCKET MESSAGE TYPES ============

// Client -> Server
export type ClientMessage =
  | { type: "create_room"; nickname: string }
  | { type: "join_room"; roomCode: RoomCode; nickname: string }
  | { type: "start_game" }
  | { type: "submit_meme"; memeId: string }
  | { type: "select_winner"; oderId: string }
  | { type: "next_round" }
  | { type: "reconnect"; playerId: PlayerId; roomCode: RoomCode };

// Server -> Client
export type ServerMessage =
  | { type: "room_created"; roomCode: RoomCode; playerId: PlayerId }
  | { type: "room_joined"; playerId: PlayerId }
  | { type: "room_state"; state: GameState }
  | { type: "hand_dealt"; hand: MemeCard[] }
  | { type: "player_joined"; player: Player }
  | { type: "player_left"; playerId: PlayerId }
  | { type: "player_reconnected"; playerId: PlayerId }
  | { type: "player_submitted"; playerId: PlayerId }
  | { type: "all_submitted"; submissions: Submission[] }
  | { type: "winner_selected"; winnerId: PlayerId; oderId: string }
  | { type: "new_round"; round: RoundState }
  | { type: "error"; message: string };

// ============ GAME SETTINGS ============

export const GAME_SETTINGS = {
  minPlayers: 3,
  maxPlayers: 10,
  memesPerHand: 10,
} as const;

export interface ServerPlayer extends Player {
  socketId: string;
  hand: MemeCard[];
}

export interface ServerRoundState {
  roundNumber: number;
  judgeId: PlayerId;
  phraseOptions: Phrase[];
  phrase: Phrase | null;
  submissions: Map<PlayerId, { memeId: string; meme: MemeCard }>;
  shuffledSubmissionOrder: PlayerId[]; // Stores shuffle order once when entering judging phase
  winnerId: PlayerId | null;
  winningMemeId: string | null;
}

export interface ServerRoom {
  code: RoomCode;
  phase: GamePhase;
  players: Map<PlayerId, ServerPlayer>;
  hostId: PlayerId;
  currentRound: ServerRoundState | null;
  usedPhraseIds: string[];
  usedMemeIds: string[];
  createdAt: number;
}

export interface RoomPublicState {
  roomCode: RoomCode;
  phase: GamePhase;
  players: Player[];
  hostId: PlayerId;
  currentRound: {
    roundNumber: number;
    judgeId: PlayerId;
    phraseOptions: Phrase[];
    phrase: Phrase | null;
    submittedPlayerIds: PlayerId[];
    revealedSubmissions: Submission[];
    winnerId: PlayerId | null;
    winningMemeId: string | null;
  } | null;
}

export function toPublicState(room: ServerRoom): RoomPublicState {
  const players: Player[] = Array.from(room.players.values()).map((p) => ({
    id: p.id,
    nickname: p.nickname,
    avatarColor: p.avatarColor,
    score: p.score,
    isConnected: p.isConnected,
    isHost: p.isHost,
    locale: p.locale,
  }));

  let currentRound = null;
  if (room.currentRound) {
    const submittedPlayerIds = Array.from(room.currentRound.submissions.keys());

    // Only reveal submissions during judging or result phase
    let revealedSubmissions: Submission[] = [];
    if (room.phase === "judging" || room.phase === "result") {
      // Use the stored shuffle order instead of re-shuffling
      // This ensures consistent order across multiple calls to toPublicState
      revealedSubmissions = room.currentRound.shuffledSubmissionOrder.map(
        (playerId, index) => {
          const sub = room.currentRound!.submissions.get(playerId)!;
          return {
            oderId: `order-${index}`,
            memeId: sub.memeId,
            meme: sub.meme,
          };
        },
      );
    }

    currentRound = {
      roundNumber: room.currentRound.roundNumber,
      judgeId: room.currentRound.judgeId,
      phraseOptions: room.currentRound.phraseOptions,
      phrase: room.currentRound.phrase,
      submittedPlayerIds,
      revealedSubmissions,
      winnerId: room.currentRound.winnerId,
      winningMemeId: room.currentRound.winningMemeId,
    };
  }

  return {
    roomCode: room.code,
    phase: room.phase,
    players,
    hostId: room.hostId,
    currentRound,
  };
}

// // import { MemeCard, Phrase, Player, PlayerId, RoomCode, GamePhase, Submission } from '../lib/game/types';

// // ============ ROOM & PLAYER TYPES ============

// export type RoomCode = string; // 6 character alphanumeric

// export type PlayerId = string; // UUID

// export interface Player {
//   id: PlayerId;
//   nickname: string;
//   avatarColor: string;
//   score: number;
//   isConnected: boolean;
//   isHost: boolean;
// }

// // ============ GAME STATE TYPES ============

// export type GamePhase =
//   | "lobby"
//   | "picking"
//   | "judging"
//   | "result"
//   | "phrase_selection";

// export interface MemeCard {
//   id: string;
//   imageUrl: string;
// }

// export interface Phrase {
//   id: string;
//   text: string;
// }

// export interface Submission {
//   oderId: string;
//   memeId: string;
//   meme: MemeCard;
// }

// export interface RoundState {
//   roundNumber: number;
//   judgeId: PlayerId;
//   phrase: Phrase;
//   submittedPlayerIds: PlayerId[];
//   revealedSubmissions: Submission[];
//   winnerId: PlayerId | null;
//   winningMemeId: string | null;
// }

// export interface GameState {
//   roomCode: RoomCode;
//   phase: GamePhase;
//   players: Player[];
//   hostId: PlayerId;
//   currentRound: RoundState | null;
// }

// // ============ CLIENT STATE ============

// export interface ClientState {
//   playerId: PlayerId | null;
//   roomCode: RoomCode | null;
//   connectionStatus:
//     | "connecting"
//     | "connected"
//     | "disconnected"
//     | "reconnecting";
//   gameState: GameState | null;
//   myHand: MemeCard[];
//   selectedMemeId: string | null;
//   hasSubmitted: boolean;
//   error: string | null;
//   isLoading: boolean;
// }

// // ============ SOCKET MESSAGE TYPES ============

// // Client -> Server
// export type ClientMessage =
//   | { type: "create_room"; nickname: string }
//   | { type: "join_room"; roomCode: RoomCode; nickname: string }
//   | { type: "start_game" }
//   | { type: "submit_meme"; memeId: string }
//   | { type: "select_winner"; oderId: string }
//   | { type: "next_round" }
//   | { type: "reconnect"; playerId: PlayerId; roomCode: RoomCode };

// // Server -> Client
// export type ServerMessage =
//   | { type: "room_created"; roomCode: RoomCode; playerId: PlayerId }
//   | { type: "room_joined"; playerId: PlayerId }
//   | { type: "room_state"; state: GameState }
//   | { type: "hand_dealt"; hand: MemeCard[] }
//   | { type: "player_joined"; player: Player }
//   | { type: "player_left"; playerId: PlayerId }
//   | { type: "player_reconnected"; playerId: PlayerId }
//   | { type: "player_submitted"; playerId: PlayerId }
//   | { type: "all_submitted"; submissions: Submission[] }
//   | { type: "winner_selected"; winnerId: PlayerId; oderId: string }
//   | { type: "new_round"; round: RoundState }
//   | { type: "error"; message: string };

// // ============ GAME SETTINGS ============

// export const GAME_SETTINGS = {
//   minPlayers: 3,
//   maxPlayers: 10,
//   memesPerHand: 10,
// } as const;

// export interface ServerPlayer extends Player {
//   socketId: string;
//   hand: MemeCard[];
// }

// // export interface ServerRoundState {
// //   roundNumber: number;
// //   judgeId: PlayerId;
// //   phrase: Phrase;
// //   submissions: Map<PlayerId, { memeId: string; meme: MemeCard }>;
// //   winnerId: PlayerId | null;
// //   winningMemeId: string | null;
// // }
// export interface ServerRoundState {
//   roundNumber: number;
//   judgeId: PlayerId;
//   phraseOptions: Phrase[];
//   phrase: Phrase | null;
//   submissions: Map<PlayerId, { memeId: string; meme: MemeCard }>;
//   shuffledSubmissionOrder: PlayerId[];  // Stores shuffle order once when entering judging phase
//   winnerId: PlayerId | null;
//   winningMemeId: string | null;
// }

// export interface ServerRoom {
//   code: RoomCode;
//   phase: GamePhase;
//   players: Map<PlayerId, ServerPlayer>;
//   hostId: PlayerId;
//   currentRound: ServerRoundState | null;
//   usedPhraseIds: string[];
//   usedMemeIds: string[];
//   createdAt: number;
// }

// // export interface RoomPublicState {
// //   roomCode: RoomCode;
// //   phase: GamePhase;
// //   players: Player[];
// //   hostId: PlayerId;
// //   currentRound: {
// //     roundNumber: number;
// //     judgeId: PlayerId;
// //     phrase: Phrase;
// //     submittedPlayerIds: PlayerId[];
// //     revealedSubmissions: Submission[];
// //     winnerId: PlayerId | null;
// //     winningMemeId: string | null;
// //   } | null;
// // }
// export interface RoomPublicState {
//   roomCode: RoomCode;
//   phase: GamePhase;
//   players: Player[];
//   hostId: PlayerId;
//   currentRound: {
//     roundNumber: number;
//     judgeId: PlayerId;
//     phraseOptions: Phrase[];
//     phrase: Phrase | null;
//     submittedPlayerIds: PlayerId[];
//     revealedSubmissions: Submission[];
//     winnerId: PlayerId | null;
//     winningMemeId: string | null;
//   } | null;
// }

// export function toPublicState(room: ServerRoom): RoomPublicState {
//   const players: Player[] = Array.from(room.players.values()).map((p) => ({
//     id: p.id,
//     nickname: p.nickname,
//     avatarColor: p.avatarColor,
//     score: p.score,
//     isConnected: p.isConnected,
//     isHost: p.isHost,
//   }));

//   let currentRound = null;
//   if (room.currentRound) {
//     const submittedPlayerIds = Array.from(room.currentRound.submissions.keys());

//     // Only reveal submissions during judging or result phase
//     let revealedSubmissions: Submission[] = [];
//     if (room.phase === "judging" || room.phase === "result") {
//       const shuffled = Array.from(room.currentRound.submissions.entries()).sort(
//         () => Math.random() - 0.5,
//       );

//       revealedSubmissions = shuffled.map(([playerId, sub], index) => ({
//         oderId: `order-${index}`,
//         memeId: sub.memeId,
//         meme: sub.meme,
//       }));
//     }

//     // currentRound = {
//     //   roundNumber: room.currentRound.roundNumber,
//     //   judgeId: room.currentRound.judgeId,
//     //   phrase: room.currentRound.phrase,
//     //   submittedPlayerIds,
//     //   revealedSubmissions,
//     //   winnerId: room.currentRound.winnerId,
//     //   winningMemeId: room.currentRound.winningMemeId,
//     // };
//     currentRound = {
//       roundNumber: room.currentRound.roundNumber,
//       judgeId: room.currentRound.judgeId,
//       phraseOptions: room.currentRound.phraseOptions,
//       phrase: room.currentRound.phrase,
//       submittedPlayerIds,
//       revealedSubmissions,
//       winnerId: room.currentRound.winnerId,
//       winningMemeId: room.currentRound.winningMemeId,
//     };
//   }

//   return {
//     roomCode: room.code,
//     phase: room.phase,
//     players,
//     hostId: room.hostId,
//     currentRound,
//   };
// }
