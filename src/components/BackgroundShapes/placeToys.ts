import type { ToyName } from '@/constants/toys';

/** Width of the design the background is laid out in; everything scales with the page width. */
export const DESIGN_WIDTH = 1920;

/** Height of one tile in design px. Tiles repeat down the page, so a taller one repeats less. */
export const TILE_HEIGHT = 3000;

/** Box side of a toy in design px; the drawing fills about 70% of it. */
const SIZE = { min: 480, max: 960 } as const;

export interface IToyPlacement {
  toy: ToyName;
  /** Centre in design px, within the tile. */
  x: number;
  y: number;
  size: number;
  /** Starting angle, degrees. */
  angle: number;
  /** Seconds per full turn; negative turns counter-clockwise. */
  spin: number;
}

interface IPlaceToysOptions {
  /** Toys per 1000×1000 design px. */
  density: number;
  seed: number;
  toys: readonly ToyName[];
}

/** Mulberry32: a tiny seeded generator, so a page gets the same arrangement on every render. */
const createRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const between = (random: () => number, min: number, max: number): number =>
  min + random() * (max - min);

/**
 * Scatters toys over one tile. A staggered grid with one toy per cell, jittered inside it, keeps
 * the spread even — no big empty patches — while still looking random. The row count is even so
 * the stagger lines up where one tile meets the next. Toys are dealt from a shuffled deck, so the
 * same one does not repeat before the others have shown up.
 */
export const placeToys = ({ density, seed, toys }: IPlaceToysOptions): IToyPlacement[] => {
  if (toys.length === 0 || density <= 0) return [];
  const random = createRandom(seed);

  const cellSide = 1000 / Math.sqrt(density);
  const columns = Math.max(1, Math.round(DESIGN_WIDTH / cellSide));
  const rows = Math.max(2, Math.round(TILE_HEIGHT / cellSide / 2) * 2);
  const cellWidth = DESIGN_WIDTH / columns;
  const cellHeight = TILE_HEIGHT / rows;

  let deck: ToyName[] = [];
  const deal = (): ToyName => {
    if (deck.length === 0) {
      deck = [...toys];
      for (let i = deck.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }
    return deck.pop() as ToyName;
  };

  const placements: IToyPlacement[] = [];
  for (let row = 0; row < rows; row += 1) {
    const shift = row % 2 === 0 ? 0 : 0.5;
    for (let column = 0; column < columns; column += 1) {
      placements.push({
        toy: deal(),
        x: (column + shift + between(random, 0.2, 0.8)) * cellWidth,
        y: (row + between(random, 0.2, 0.8)) * cellHeight,
        size: between(random, SIZE.min, SIZE.max),
        angle: between(random, 0, 360),
        spin: between(random, 40, 90) * (random() < 0.5 ? -1 : 1),
      });
    }
  }
  return placements;
};
