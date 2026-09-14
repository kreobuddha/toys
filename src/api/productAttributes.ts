import type { AgeGroup, Condition, IPriceRange, IProductsQuery, SortOption } from './types';

// Product attribute constants and helpers shared by the UI and the mocks. No React here.

/** Age groups in months: `from` inclusive, `to` exclusive and absent for the open last group. */
export const AGE_GROUPS: readonly { id: AgeGroup; from: number; to?: number }[] = [
  { id: '0-6', from: 0, to: 6 },
  { id: '6-12', from: 6, to: 12 },
  { id: '12-18', from: 12, to: 18 },
  { id: '18-24', from: 18, to: 24 },
  { id: '24-36', from: 24, to: 36 },
  { id: '36-plus', from: 36 },
];

export const CONDITIONS: readonly Condition[] = ['new', 'excellent', 'good'];

/** Brand filter value that matches products without a brand. */
export const OTHER_BRAND = 'other';

export const SORT_OPTIONS: readonly SortOption[] = ['price_asc', 'price_desc'];

/** Price slider step in minor units: whole euros. */
export const PRICE_STEP = 100;

export type ListKey = 'categories' | 'brands' | 'ageGroups' | 'conditions';

/** Names of the list query parameters, shared by the shop URL and the products API. */
export const LIST_PARAMS: Record<ListKey, string> = {
  categories: 'category',
  brands: 'brand',
  ageGroups: 'age',
  conditions: 'condition',
};

export const isAgeGroup = (value: string): value is AgeGroup =>
  AGE_GROUPS.some((group) => group.id === value);

export const isCondition = (value: string): value is Condition =>
  CONDITIONS.includes(value as Condition);

export const isSortOption = (value: string | null): value is SortOption =>
  SORT_OPTIONS.includes(value as SortOption);

/** Without duplicates and sorted, so equal selections share one RTK cache entry and one URL. */
export const normalizeList = <T extends string>(values: readonly T[]): T[] =>
  [...new Set(values)].sort();

/** A comma-separated query value as a list: blanks and duplicates dropped, sorted. */
export const parseList = (value: string | null): string[] =>
  normalizeList(
    (value ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  );

/**
 * Products API query parameters. Lists are joined with commas and left out when empty: passed
 * as arrays, fetchBaseQuery would send `category=` for an empty one.
 */
export const toProductsParams = (query: IProductsQuery): Record<string, string | number> => {
  const { categories, brands, ageGroups, conditions, ...rest } = query;
  const lists: Record<ListKey, readonly string[] | undefined> = {
    categories,
    brands,
    ageGroups,
    conditions,
  };
  const params: Record<string, string | number> = {};
  for (const key of Object.keys(LIST_PARAMS) as ListKey[]) {
    const values = lists[key];
    if (values?.length) params[LIST_PARAMS[key]] = values.join(',');
  }
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined) params[key] = value;
  }
  return params;
};

/** Facet price bounds widened to whole slider steps, so both ends of the slider are reachable. */
export const toPriceBounds = ({ min, max }: IPriceRange): IPriceRange => ({
  min: Math.floor(min / PRICE_STEP) * PRICE_STEP,
  max: Math.ceil(max / PRICE_STEP) * PRICE_STEP,
});
