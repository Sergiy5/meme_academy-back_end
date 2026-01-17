export const GAME_CONFIG = {
  minPlayers: 3,
  maxPlayers: 10,
  memesPerHand: 10,
  roomCodeLength: 6,
  reconnectGracePeriodMs: 30000,
} as const;

// High contrast, visually distinct colors for avatars
export const AVATAR_COLORS = [
  '#FF3366', // Bright pink/red
  '#33FF57', // Bright green
  '#3366FF', // Bright blue
  '#FFCC00', // Yellow/gold
  '#FF6600', // Orange
  '#CC33FF', // Purple/magenta
  '#00CCCC', // Cyan/teal
  '#FF0099', // Hot pink
  '#66FF33', // Lime green
  '#0099FF', // Sky blue
];

export function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < GAME_CONFIG.roomCodeLength; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function generatePlayerId(): string {
  return crypto.randomUUID();
}
