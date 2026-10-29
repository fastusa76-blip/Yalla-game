import { DominoPlacedTile, DominoTile } from '../types/game';

export function createDominoSet(): DominoTile[] {
  const set: DominoTile[] = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      set.push({
        id: `tile_${i}_${j}`,
        left: i,
        right: j,
        isDouble: i === j
      });
    }
  }
  return shuffle(set);
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function canPlayTile(tile: DominoTile, leftOpen: number | null, rightOpen: number | null): {
  canPlayLeft: boolean;
  canPlayRight: boolean;
} {
  if (leftOpen === null || rightOpen === null) {
    return { canPlayLeft: true, canPlayRight: true };
  }
  const canPlayLeft = tile.left === leftOpen || tile.right === leftOpen;
  const canPlayRight = tile.left === rightOpen || tile.right === rightOpen;
  return { canPlayLeft, canPlayRight };
}

export function getLegalMoves(hand: DominoTile[], leftOpen: number | null, rightOpen: number | null): DominoTile[] {
  if (leftOpen === null || rightOpen === null) return hand;
  return hand.filter((t) => {
    const { canPlayLeft, canPlayRight } = canPlayTile(t, leftOpen, rightOpen);
    return canPlayLeft || canPlayRight;
  });
}

export function orientTile(tile: DominoTile, targetEnd: 'left' | 'right', openValue: number | null): DominoPlacedTile {
  if (openValue === null) {
    return {
      ...tile,
      placedEnd: 'left',
      rotation: 0
    };
  }

  // If connecting to leftEnd: tile's connecting pip must match openValue (placed toward inner chain)
  // If connecting to rightEnd: tile's connecting pip must match openValue
  if (targetEnd === 'left') {
    // If tile.right matches leftOpen, normal orientation [left, right] connects right to openValue
    if (tile.right === openValue) {
      return { ...tile, placedEnd: 'left', rotation: 0 };
    } else {
      // Flip so [right, left]
      return { ...tile, left: tile.right, right: tile.left, placedEnd: 'left', rotation: 180 };
    }
  } else {
    // targetEnd is right: connecting to rightOpen
    if (tile.left === openValue) {
      return { ...tile, placedEnd: 'right', rotation: 0 };
    } else {
      return { ...tile, left: tile.right, right: tile.left, placedEnd: 'right', rotation: 180 };
    }
  }
}

export function calculateHandPips(hand: DominoTile[]): number {
  return hand.reduce((acc, t) => acc + t.left + t.right, 0);
}
