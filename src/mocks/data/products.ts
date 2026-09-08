import type { IProduct } from '@/api/types';

export const CATEGORIES = [
  'Puzzles',
  'Building',
  'Music',
  'Books',
  'Outdoor',
  'Role play',
] as const;
export const AGE_RANGES = ['0-1', '1-3', '3-5', '5-8', '8+'] as const;
const CONDITIONS = ['Like new', 'Very good', 'Good'] as const;

const NAMES = [
  'Wooden Stacking Rings',
  'Magnetic Tiles Set',
  'Shape Sorter Cube',
  'Xylophone',
  'Alphabet Puzzle',
  'Balance Bike',
  'Play Kitchen',
  'Marble Run',
  'Counting Bears',
  'Busy Board',
  'Train Track Set',
  'Felt Story Book',
  'Rainbow Stacker',
  'Doctor Kit',
  'Geoboard',
  'Tangram Puzzle',
  'Toy Drum',
  'Garden Tools Set',
  'Lacing Beads',
  'Animal Dominoes',
];

// Deterministic pseudo-random so the catalog looks the same on every reload.
const rng = (seed: number): (() => number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

const pick = <T>(r: () => number, arr: readonly T[]): T => arr[Math.floor(r() * arr.length)];

export const products: IProduct[] = Array.from({ length: 47 }, (_, i) => {
  const r = rng(i + 1);
  const name = NAMES[i % NAMES.length];
  const title = i < NAMES.length ? name : `${name} ${Math.floor(i / NAMES.length) + 1}`;
  const id = i + 1;
  return {
    id,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    title,
    description:
      `${title} in ${pick(r, CONDITIONS).toLowerCase()} condition. Cleaned, checked and ready ` +
      'for a new home. Develops fine motor skills, logic and imagination.',
    price: 500 + Math.floor(r() * 90) * 50, // €5.00 – €50.00
    currency: 'EUR',
    images: [1, 2, 3].map((n) => `https://picsum.photos/seed/toy-${id}-${n}/600/600`),
    category: pick(r, CATEGORIES),
    ageRange: pick(r, AGE_RANGES),
    condition: pick(r, CONDITIONS),
    inStock: r() > 0.15,
    articleSlug: r() > 0.5 ? 'why-open-ended-toys-matter' : undefined,
  };
});
