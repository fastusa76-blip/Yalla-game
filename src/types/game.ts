export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color?: PlayerColor;
  isHost?: boolean;
  isBot?: boolean;
  isUser?: boolean;
  seatIndex: number; // 0 to 7 (-1 for spectators)
  micActive: boolean;
  isSpeaking: boolean;
  micLevel: number; // 0 to 1
  vipLevel: number; // 0 to 5
  level: number;
  coins: number;
  diamonds: number;
  charmPoints: number;
}

export interface VoiceSeat {
  seatIndex: number;
  player: Player | null;
  isLocked: boolean;
  isMutedByHost: boolean;
}

export type GameType = 'ludo' | 'domino' | 'wheel' | 'none';

export interface VoiceRoom {
  id: string;
  title: string;
  category: 'ludo' | 'domino' | 'party' | 'gaming';
  announcement: string;
  bgTheme: 'majlis' | 'cyber' | 'lounge' | 'royal';
  bgImageUrl: string;
  hostId: string;
  seats: (Player | null)[];
  spectatorCount: number;
  activeGame: GameType;
  gameBet: number;
  hotScore: number;
}

// LUDO TYPES
export interface LudoToken {
  id: number; // 0, 1, 2, 3
  color: PlayerColor;
  state: 'YARD' | 'TRACK' | 'HOME_STRETCH' | 'HOME';
  stepCount: number; // 0 = at spawn, up to 56 (51 = last track step, 52-56 = home stretch, 57 = home)
  trackPosition: number; // 0-51 on global track
}

export interface LudoPlayerState {
  id: string;
  name: string;
  color: PlayerColor;
  tokens: LudoToken[];
  isBot: boolean;
  isUser: boolean;
  hasWon: boolean;
  finishRank?: number;
}

export interface LudoGameState {
  players: LudoPlayerState[];
  currentTurnColor: PlayerColor;
  diceValue: number;
  isRolling: boolean;
  hasRolled: boolean;
  canRoll: boolean;
  movableTokenIds: number[];
  winnerColor: PlayerColor | null;
  turnCountdown: number; // seconds remaining
  log: string[];
}

// DOMINO TYPES
export interface DominoTile {
  id: string;
  left: number; // 0-6
  right: number; // 0-6
  isDouble: boolean;
}

export interface DominoPlacedTile extends DominoTile {
  placedEnd: 'left' | 'right';
  rotation: 0 | 90 | 180 | 270;
}

export interface DominoPlayerState {
  id: string;
  name: string;
  hand: DominoTile[];
  score: number;
  isBot: boolean;
  isUser: boolean;
}

export interface DominoGameState {
  players: DominoPlayerState[];
  currentTurnIndex: number;
  chain: DominoPlacedTile[];
  leftOpenValue: number | null;
  rightOpenValue: number | null;
  boneyard: DominoTile[];
  winnerId: string | null;
  isBlocked: boolean;
  turnCountdown: number;
  roundLog: string[];
}

// GIFTS
export type GiftType = 'rocket' | 'supercar' | 'crown' | 'rose' | 'fireworks' | 'ring';

export interface GiftItem {
  id: GiftType;
  name: string;
  icon: string;
  price: number; // in diamonds
  charmValue: number;
  description: string;
}

export interface ActiveGiftAnimation {
  id: string;
  gift: GiftItem;
  sender: Player;
  recipient: Player;
  timestamp: number;
}

// CHAT
export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  vipLevel: number;
  type: 'chat' | 'gift' | 'system' | 'game';
  text: string;
  giftIcon?: string;
  giftName?: string;
  targetName?: string;
  timestamp: string;
}

// LEADERBOARD
export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  country: string;
  countryFlag: string;
  vipLevel: number;
  level: number;
  charmPoints: number;
  totalWins: number;
  totalMatches: number;
  winRate: number;
  coinsWon: number;
  title: string;
  favoriteGame: 'Ludo' | 'Dominoes' | 'All';
  isUser?: boolean;
}
