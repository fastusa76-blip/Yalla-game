import { GiftItem, Player, VoiceRoom } from '../types/game';

export const INITIAL_USER: Player = {
  id: 'user_me',
  name: 'Majid Al-Noor',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Majid&mouth=smile&eyebrows=default',
  color: 'yellow',
  isHost: false,
  isBot: false,
  isUser: true,
  seatIndex: 0,
  micActive: false,
  isSpeaking: false,
  micLevel: 0,
  vipLevel: 3,
  level: 28,
  coins: 65400,
  diamonds: 1420,
  charmPoints: 12850
};

export const BOT_PLAYERS: Player[] = [
  {
    id: 'bot_host',
    name: '👑 Sheikh Tariq',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq&beard=light&clothing=formal',
    color: 'red',
    isHost: true,
    isBot: true,
    seatIndex: 0,
    micActive: true,
    isSpeaking: true,
    micLevel: 0.75,
    vipLevel: 5,
    level: 64,
    coins: 980000,
    diamonds: 45000,
    charmPoints: 94000
  },
  {
    id: 'bot_1',
    name: 'Yasmin Star',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmin&hair=long&mouth=smile',
    color: 'green',
    isBot: true,
    seatIndex: 1,
    micActive: true,
    isSpeaking: false,
    micLevel: 0,
    vipLevel: 4,
    level: 42,
    coins: 210000,
    diamonds: 6200,
    charmPoints: 34000
  },
  {
    id: 'bot_2',
    name: 'Karim Pro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim&hair=short&eyes=happy',
    color: 'blue',
    isBot: true,
    seatIndex: 2,
    micActive: false,
    isSpeaking: false,
    micLevel: 0,
    vipLevel: 2,
    level: 19,
    coins: 45000,
    diamonds: 890,
    charmPoints: 7800
  },
  {
    id: 'bot_3',
    name: 'Layla Gamer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Layla&eyes=wink&mouth=smile',
    isBot: true,
    seatIndex: 3,
    micActive: true,
    isSpeaking: false,
    micLevel: 0,
    vipLevel: 3,
    level: 31,
    coins: 112000,
    diamonds: 2400,
    charmPoints: 16500
  },
  {
    id: 'bot_4',
    name: 'Faisal 99',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Faisal&mouth=twinkle',
    isBot: true,
    seatIndex: 4,
    micActive: false,
    isSpeaking: false,
    micLevel: 0,
    vipLevel: 1,
    level: 14,
    coins: 28000,
    diamonds: 340,
    charmPoints: 3200
  },
  {
    id: 'bot_5',
    name: 'Noor Queen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noor&mouth=smile',
    isBot: true,
    seatIndex: 5,
    micActive: true,
    isSpeaking: true,
    micLevel: 0.6,
    vipLevel: 4,
    level: 48,
    coins: 340000,
    diamonds: 14000,
    charmPoints: 52000
  }
];

export const INITIAL_ROOMS: VoiceRoom[] = [
  {
    id: 'room_ludo_1',
    title: '🔥 Gulf Champions 4P Ludo [5K Bet]',
    category: 'ludo',
    announcement: 'Welcome to the High Stakes Ludo arena! Turn on your mic, respect all players, and may the sixes roll your way!',
    bgTheme: 'majlis',
    bgImageUrl: '/src/assets/images/room_bg_royal_majlis_1792988499294.jpg',
    hostId: 'bot_host',
    seats: [
      BOT_PLAYERS[0], // Sheikh Tariq
      BOT_PLAYERS[1], // Yasmin
      BOT_PLAYERS[2], // Karim
      null, // Empty seat for user or guest
      BOT_PLAYERS[3], // Layla
      BOT_PLAYERS[4], // Faisal
      BOT_PLAYERS[5], // Noor
      null
    ],
    spectatorCount: 184,
    activeGame: 'ludo',
    gameBet: 5000,
    hotScore: 9840
  },
  {
    id: 'room_domino_2',
    title: '👑 VIP Royal Dominoes & Voice Party',
    category: 'domino',
    announcement: 'Classic Draw & Block Dominoes championship. Highest double opens! Fast turns & voice banter welcome.',
    bgTheme: 'majlis',
    bgImageUrl: '/src/assets/images/room_bg_royal_majlis_1792988499294.jpg',
    hostId: 'bot_host',
    seats: [
      BOT_PLAYERS[0],
      BOT_PLAYERS[2],
      null,
      BOT_PLAYERS[1],
      null,
      null,
      null,
      null
    ],
    spectatorCount: 96,
    activeGame: 'domino',
    gameBet: 2000,
    hotScore: 6420
  },
  {
    id: 'room_cyber_3',
    title: '⚡ Quick Ludo Blitz & Late Chill',
    category: 'ludo',
    announcement: '10-minute fast dice roll matches! Join mic to chat music and strategy.',
    bgTheme: 'cyber',
    bgImageUrl: '/src/assets/images/room_bg_cyber_neon_1792988499489.jpg',
    hostId: 'bot_1',
    seats: [
      BOT_PLAYERS[1],
      BOT_PLAYERS[3],
      null,
      null,
      null,
      null,
      null,
      null
    ],
    spectatorCount: 52,
    activeGame: 'ludo',
    gameBet: 1000,
    hotScore: 4200
  },
  {
    id: 'room_party_4',
    title: '🌟 Arabic & Global Voice Party & Lucky Wheel',
    category: 'party',
    announcement: 'Open stage for singing, trivia, lucky wheel spins, and luxury gift exchanges!',
    bgTheme: 'cyber',
    bgImageUrl: '/src/assets/images/room_bg_cyber_neon_1792988499489.jpg',
    hostId: 'bot_5',
    seats: [
      BOT_PLAYERS[5],
      BOT_PLAYERS[4],
      BOT_PLAYERS[3],
      BOT_PLAYERS[2],
      BOT_PLAYERS[1],
      null,
      null,
      null
    ],
    spectatorCount: 310,
    activeGame: 'wheel',
    gameBet: 500,
    hotScore: 12500
  }
];

export const GIFTS_CATALOGUE: GiftItem[] = [
  {
    id: 'rocket',
    name: 'Galaxy Rocket',
    icon: '🚀',
    price: 999,
    charmValue: 5000,
    description: 'Blasts across the entire room with rocket thruster flares and cosmic sound!'
  },
  {
    id: 'supercar',
    name: 'Golden Phantom',
    icon: '🏎️',
    price: 500,
    charmValue: 2500,
    description: 'Luxury gold sports car drifts across the screen with roaring engine!'
  },
  {
    id: 'crown',
    name: 'Royal Diamond Crown',
    icon: '👑',
    price: 299,
    charmValue: 1500,
    description: 'Adorns the recipient with a shimmering diamond crown!'
  },
  {
    id: 'fireworks',
    name: 'Celebration Fireworks',
    icon: '🎆',
    price: 99,
    charmValue: 500,
    description: 'Fires colorful bursts of sparkling confetti and celebratory trumpets!'
  },
  {
    id: 'ring',
    name: 'Solitaire Diamond',
    icon: '💍',
    price: 49,
    charmValue: 250,
    description: 'Gleaming platinum ring with radiant light gleam!'
  },
  {
    id: 'rose',
    name: 'Royal Velvet Rose',
    icon: '🌹',
    price: 10,
    charmValue: 50,
    description: 'A shower of fragrant red velvet rose petals!'
  }
];

export const LEADERBOARD_PLAYERS = [
  {
    id: 'bot_host',
    rank: 1,
    name: '👑 Sheikh Tariq',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq&beard=light&clothing=formal',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    vipLevel: 5,
    level: 64,
    charmPoints: 194500,
    totalWins: 1420,
    totalMatches: 1890,
    winRate: 75,
    coinsWon: 4850000,
    title: 'Grand Sultan of Majlis',
    favoriteGame: 'Ludo' as const
  },
  {
    id: 'bot_5',
    rank: 2,
    name: 'Noor Queen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noor&mouth=smile',
    country: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    vipLevel: 5,
    level: 58,
    charmPoints: 168200,
    totalWins: 1280,
    totalMatches: 1710,
    winRate: 74,
    coinsWon: 3920000,
    title: 'Empress of Dominoes',
    favoriteGame: 'Dominoes' as const
  },
  {
    id: 'player_ammar',
    rank: 3,
    name: 'Captain Ammar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ammar&eyebrows=up',
    country: 'Kuwait',
    countryFlag: '🇰🇼',
    vipLevel: 4,
    level: 52,
    charmPoints: 142800,
    totalWins: 1195,
    totalMatches: 1640,
    winRate: 72,
    coinsWon: 3450000,
    title: 'Dice Legend',
    favoriteGame: 'Ludo' as const
  },
  {
    id: 'bot_1',
    rank: 4,
    name: 'Yasmin Star',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmin&hair=long&mouth=smile',
    country: 'Qatar',
    countryFlag: '🇶🇦',
    vipLevel: 4,
    level: 46,
    charmPoints: 118400,
    totalWins: 980,
    totalMatches: 1420,
    winRate: 69,
    coinsWon: 2780000,
    title: 'Voice Starlet',
    favoriteGame: 'Ludo' as const
  },
  {
    id: 'player_hamza',
    rank: 5,
    name: 'Hamza Desert Hawk',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hamza&clothing=hoodie',
    country: 'Bahrain',
    countryFlag: '🇧🇭',
    vipLevel: 4,
    level: 44,
    charmPoints: 96500,
    totalWins: 890,
    totalMatches: 1310,
    winRate: 68,
    coinsWon: 2150000,
    title: 'Tactical Mastermind',
    favoriteGame: 'Dominoes' as const
  },
  {
    id: 'bot_3',
    rank: 6,
    name: 'Layla Gamer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Layla&eyes=wink&mouth=smile',
    country: 'Egypt',
    countryFlag: '🇪🇬',
    vipLevel: 3,
    level: 38,
    charmPoints: 78900,
    totalWins: 745,
    totalMatches: 1120,
    winRate: 66,
    coinsWon: 1890000,
    title: 'Ludo Prodigy',
    favoriteGame: 'Ludo' as const
  },
  {
    id: 'player_rashid',
    rank: 7,
    name: 'Rashid Al-Dhaheri',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rashid&beard=medium',
    country: 'Oman',
    countryFlag: '🇴🇲',
    vipLevel: 3,
    level: 35,
    charmPoints: 64200,
    totalWins: 680,
    totalMatches: 1040,
    winRate: 65,
    coinsWon: 1540000,
    title: 'Majlis Champion',
    favoriteGame: 'All' as const
  },
  {
    id: 'bot_2',
    rank: 8,
    name: 'Karim Pro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim&hair=short&eyes=happy',
    country: 'Morocco',
    countryFlag: '🇲🇦',
    vipLevel: 2,
    level: 30,
    charmPoints: 49800,
    totalWins: 520,
    totalMatches: 830,
    winRate: 62,
    coinsWon: 1120000,
    title: 'Speed Roller',
    favoriteGame: 'Ludo' as const
  },
  {
    id: 'player_dalia',
    rank: 9,
    name: 'Princess Dalia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dalia&mouth=twinkle',
    country: 'Jordan',
    countryFlag: '🇯🇴',
    vipLevel: 3,
    level: 29,
    charmPoints: 41500,
    totalWins: 460,
    totalMatches: 740,
    winRate: 62,
    coinsWon: 980000,
    title: 'Charm Queen',
    favoriteGame: 'Dominoes' as const
  },
  {
    id: 'bot_4',
    rank: 10,
    name: 'Faisal 99',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Faisal&mouth=twinkle',
    country: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    vipLevel: 2,
    level: 25,
    charmPoints: 31200,
    totalWins: 380,
    totalMatches: 610,
    winRate: 62,
    coinsWon: 760000,
    title: 'Rising Star',
    favoriteGame: 'Ludo' as const
  },
  {
    id: 'user_me',
    rank: 14,
    name: 'Majid Al-Noor (You)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Majid&mouth=smile&eyebrows=default',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    vipLevel: 3,
    level: 28,
    charmPoints: 12850,
    totalWins: 96,
    totalMatches: 142,
    winRate: 68,
    coinsWon: 420000,
    title: 'Elite Contender',
    favoriteGame: 'Ludo' as const,
    isUser: true
  }
];

