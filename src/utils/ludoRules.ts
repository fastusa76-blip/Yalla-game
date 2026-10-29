import { LudoToken, PlayerColor } from '../types/game';

export interface GridCoord {
  r: number;
  c: number;
}

export const LUDO_COLORS: PlayerColor[] = ['red', 'blue', 'yellow', 'green'];

export const COLOR_CONFIG: Record<PlayerColor, {
  name: string;
  primary: string;
  light: string;
  border: string;
  startIndex: number;
  homeStretchStartStep: number;
  yardCoords: GridCoord[];
}> = {
  red: {
    name: 'Red',
    primary: '#ef4444',
    light: '#fee2e2',
    border: '#b91c1c',
    startIndex: 0,
    homeStretchStartStep: 51,
    yardCoords: [
      { r: 2, c: 11 }, { r: 2, c: 13 },
      { r: 4, c: 11 }, { r: 4, c: 13 }
    ]
  },
  blue: {
    name: 'Blue',
    primary: '#3b82f6',
    light: '#dbeafe',
    border: '#1d4ed8',
    startIndex: 13,
    homeStretchStartStep: 51,
    yardCoords: [
      { r: 11, c: 11 }, { r: 11, c: 13 },
      { r: 13, c: 11 }, { r: 13, c: 13 }
    ]
  },
  yellow: {
    name: 'Yellow',
    primary: '#eab308',
    light: '#fef9c3',
    border: '#a16207',
    startIndex: 26,
    homeStretchStartStep: 51,
    yardCoords: [
      { r: 11, c: 2 }, { r: 11, c: 4 },
      { r: 13, c: 2 }, { r: 13, c: 4 }
    ]
  },
  green: {
    name: 'Green',
    primary: '#10b981',
    light: '#d1fae5',
    border: '#047857',
    startIndex: 39,
    homeStretchStartStep: 51,
    yardCoords: [
      { r: 2, c: 2 }, { r: 2, c: 4 },
      { r: 4, c: 2 }, { r: 4, c: 4 }
    ]
  }
};

// 52 GLOBAL TRACK CELLS
export const GLOBAL_TRACK: GridCoord[] = [
  /* 0 - Red Start */  { r: 1, c: 8 },
  /* 1 */              { r: 2, c: 8 },
  /* 2 */              { r: 3, c: 8 },
  /* 3 */              { r: 4, c: 8 },
  /* 4 */              { r: 5, c: 8 },
  /* 5 */              { r: 6, c: 9 },
  /* 6 */              { r: 6, c: 10 },
  /* 7 */              { r: 6, c: 11 },
  /* 8 - Safe Star */  { r: 6, c: 12 },
  /* 9 */              { r: 6, c: 13 },
  /* 10 */             { r: 6, c: 14 },
  /* 11 */             { r: 7, c: 14 },
  /* 12 */             { r: 8, c: 14 },
  /* 13 - Blue Start */{ r: 8, c: 13 },
  /* 14 */             { r: 8, c: 12 },
  /* 15 */             { r: 8, c: 11 },
  /* 16 */             { r: 8, c: 10 },
  /* 17 */             { r: 8, c: 9 },
  /* 18 */             { r: 9, c: 8 },
  /* 19 */             { r: 10, c: 8 },
  /* 20 */             { r: 11, c: 8 },
  /* 21 - Safe Star */ { r: 12, c: 8 },
  /* 22 */             { r: 13, c: 8 },
  /* 23 */             { r: 14, c: 8 },
  /* 24 */             { r: 14, c: 7 },
  /* 25 */             { r: 14, c: 6 },
  /* 26 - Yellow Start*/{ r: 13, c: 6 },
  /* 27 */             { r: 12, c: 6 },
  /* 28 */             { r: 11, c: 6 },
  /* 29 */             { r: 10, c: 6 },
  /* 30 */             { r: 9, c: 6 },
  /* 31 */             { r: 8, c: 5 },
  /* 32 */             { r: 8, c: 4 },
  /* 33 */             { r: 8, c: 3 },
  /* 34 - Safe Star */ { r: 8, c: 2 },
  /* 35 */             { r: 8, c: 1 },
  /* 36 */             { r: 8, c: 0 },
  /* 37 */             { r: 7, c: 0 },
  /* 38 */             { r: 6, c: 0 },
  /* 39 - Green Start*/{ r: 6, c: 1 },
  /* 40 */             { r: 6, c: 2 },
  /* 41 */             { r: 6, c: 3 },
  /* 42 */             { r: 6, c: 4 },
  /* 43 */             { r: 6, c: 5 },
  /* 44 */             { r: 5, c: 6 },
  /* 45 */             { r: 4, c: 6 },
  /* 46 */             { r: 3, c: 6 },
  /* 47 - Safe Star */ { r: 2, c: 6 },
  /* 48 */             { r: 1, c: 6 },
  /* 49 */             { r: 0, c: 6 },
  /* 50 */             { r: 0, c: 7 },
  /* 51 */             { r: 0, c: 8 }
];

// 8 Safe Stars: 4 Spawns (0, 13, 26, 39) + 4 safe cells (8, 21, 34, 47)
export const SAFE_TRACK_INDICES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

// HOME STRETCHES
export const HOME_STRETCHES: Record<PlayerColor, GridCoord[]> = {
  red: [
    { r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 }, { r: 6, c: 7 }
  ],
  blue: [
    { r: 7, c: 13 }, { r: 7, c: 12 }, { r: 7, c: 11 }, { r: 7, c: 10 }, { r: 7, c: 9 }, { r: 7, c: 8 }
  ],
  yellow: [
    { r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 }, { r: 8, c: 7 }
  ],
  green: [
    { r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 }, { r: 7, c: 6 }
  ]
};

export const MAX_STEPS = 57; // 0..50 on track, 51..56 home stretch, 57 is home crown

export function getTokenCoord(token: LudoToken): GridCoord {
  if (token.state === 'YARD') {
    return COLOR_CONFIG[token.color].yardCoords[token.id];
  }
  if (token.state === 'HOME') {
    return HOME_STRETCHES[token.color][5];
  }
  if (token.state === 'HOME_STRETCH') {
    const stretchIdx = token.stepCount - 51;
    return HOME_STRETCHES[token.color][Math.min(stretchIdx, 5)];
  }
  // ON_TRACK
  const globalIdx = (COLOR_CONFIG[token.color].startIndex + token.stepCount) % 52;
  return GLOBAL_TRACK[globalIdx];
}

export function canTokenMove(token: LudoToken, dice: number): boolean {
  if (token.state === 'HOME') return false;
  if (token.state === 'YARD') {
    return dice === 6;
  }
  // Currently on track or in stretch
  return token.stepCount + dice <= MAX_STEPS;
}

export function getMovableTokens(tokens: LudoToken[], dice: number): number[] {
  return tokens.filter((t) => canTokenMove(t, dice)).map((t) => t.id);
}
