import { AGE_GROUPS, CONDITIONS } from '@/api/productAttributes';
import type { IBrand, ICategory, IProduct } from '@/api/types';

export const CATEGORIES: ICategory[] = [
  { slug: 'building', name: 'Building' },
  { slug: 'puzzles', name: 'Puzzles' },
  { slug: 'sorters', name: 'Sorters' },
  { slug: 'practical-life', name: 'Practical life' },
  { slug: 'pyramid', name: 'Pyramid' },
  { slug: 'balancing', name: 'Balancing' },
];

export const BRANDS: IBrand[] = [
  { slug: 'lovevery', name: 'Lovevery' },
  { slug: 'djeco', name: 'Djeco' },
  { slug: 'done-by-deer', name: 'Done by Deer' },
  { slug: 'vertbaudet', name: 'Vertbaudet' },
  { slug: 'little-dutch', name: 'Little Dutch' },
  { slug: 'ikea', name: 'Ikea' },
  { slug: 'janod', name: 'Janod' },
];

// Toy names by category slug; a name used again gets a number.
const NAMES: Record<string, string[]> = {
  building: ['Wooden Block Set', 'Magnetic Tiles Set', 'Marble Run', 'Train Track Set'],
  puzzles: ['Alphabet Puzzle', 'Tangram Puzzle', 'Animal Peg Puzzle', 'Farm Jigsaw'],
  sorters: ['Shape Sorter Cube', 'Colour Sorting Bowls', 'Coin Posting Box', 'Counting Bears'],
  'practical-life': ['Busy Board', 'Dressing Frame', 'Pouring Set', 'Mini Cleaning Set'],
  pyramid: ['Rainbow Stacker', 'Wooden Stacking Rings', 'Stacking Cups', 'Nesting Pyramid'],
  balancing: ['Balance Board', 'Balancing Stones', 'Stacking Cactus', 'Balancing Blocks'],
};

const UNBRANDED_SHARE = 0.2;

// Deterministic pseudo-random (mulberry32) so the shop looks the same on every reload. Its
// output mixing keeps neighbouring seeds apart; a plain LCG gave runs of one category.
const rng = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T>(r: () => number, arr: readonly T[]): T => arr[Math.floor(r() * arr.length)];

const namesUsed = new Map<string, number>();

export const products: IProduct[] = Array.from({ length: 47 }, (_, i) => {
  const r = rng(i + 1);
  const id = i + 1;
  const category = pick(r, CATEGORIES);
  const names = NAMES[category.slug];
  const used = namesUsed.get(category.slug) ?? 0;
  namesUsed.set(category.slug, used + 1);
  const name = names[used % names.length];
  const title = used < names.length ? name : `${name} ${Math.floor(used / names.length) + 1}`;
  const condition = pick(r, CONDITIONS);
  // One to three neighbouring age groups.
  const firstAgeGroup = Math.floor(r() * AGE_GROUPS.length);
  const ageGroupCount = 1 + Math.floor(r() * 3);
  const brand = r() < UNBRANDED_SHARE ? undefined : pick(r, BRANDS);
  return {
    id,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    title,
    description:
      `${title} in ${condition} condition. Cleaned, checked and ready ` +
      'for a new home. Develops fine motor skills, logic and imagination.',
    price: 500 + Math.floor(r() * 90) * 50, // €5.00 – €49.50
    currency: 'EUR',
    images: [1, 2, 3].map((n) => `https://picsum.photos/seed/toy-${id}-${n}/1200/1200`),
    category,
    brand,
    condition,
    ageGroups: AGE_GROUPS.slice(firstAgeGroup, firstAgeGroup + ageGroupCount).map((g) => g.id),
    inStock: r() > 0.15,
    articleSlug: r() > 0.5 ? 'why-open-ended-toys-matter' : undefined,
  };
});
