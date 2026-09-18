import type { ProductAgeRange, ProductCondition, ProductSort } from '@/types/product';

// Catalog attributes that stay on the frontend. Categories and brands come from the catalog
// (GetProductFacets and the products themselves); age ranges and conditions are protobuf enums,
// so their order, their bounds in months and their localized names live here.

export const AGE_RANGES: readonly ProductAgeRange[] = [
  'PRODUCT_AGE_RANGE_0_TO_6_MONTHS',
  'PRODUCT_AGE_RANGE_6_TO_12_MONTHS',
  'PRODUCT_AGE_RANGE_12_TO_18_MONTHS',
  'PRODUCT_AGE_RANGE_18_TO_24_MONTHS',
  'PRODUCT_AGE_RANGE_2_TO_3_YEARS',
  'PRODUCT_AGE_RANGE_3_YEARS_AND_UP',
];

export const CONDITIONS: readonly ProductCondition[] = [
  'PRODUCT_CONDITION_NEW',
  'PRODUCT_CONDITION_PRELOVED',
];

export const SORT_OPTIONS: readonly ProductSort[] = [
  'PRODUCT_SORT_PRICE_ASCENDING',
  'PRODUCT_SORT_PRICE_DESCENDING',
];

/** Age bounds in months: `from` inclusive, `to` exclusive and absent for the open last range. */
export const AGE_RANGE_MONTHS: Record<ProductAgeRange, { from: number; to?: number }> = {
  PRODUCT_AGE_RANGE_UNSPECIFIED: { from: 0 },
  PRODUCT_AGE_RANGE_0_TO_6_MONTHS: { from: 0, to: 6 },
  PRODUCT_AGE_RANGE_6_TO_12_MONTHS: { from: 6, to: 12 },
  PRODUCT_AGE_RANGE_12_TO_18_MONTHS: { from: 12, to: 18 },
  PRODUCT_AGE_RANGE_18_TO_24_MONTHS: { from: 18, to: 24 },
  PRODUCT_AGE_RANGE_2_TO_3_YEARS: { from: 24, to: 36 },
  PRODUCT_AGE_RANGE_3_YEARS_AND_UP: { from: 36 },
};

// Short aliases keep the shop URL readable: /en/shop?age=12-18 instead of the enum name.
// Categories and brands need none — their slugs are already short.

export const AGE_RANGE_SLUGS: Record<ProductAgeRange, string> = {
  PRODUCT_AGE_RANGE_UNSPECIFIED: '',
  PRODUCT_AGE_RANGE_0_TO_6_MONTHS: '0-6',
  PRODUCT_AGE_RANGE_6_TO_12_MONTHS: '6-12',
  PRODUCT_AGE_RANGE_12_TO_18_MONTHS: '12-18',
  PRODUCT_AGE_RANGE_18_TO_24_MONTHS: '18-24',
  PRODUCT_AGE_RANGE_2_TO_3_YEARS: '24-36',
  PRODUCT_AGE_RANGE_3_YEARS_AND_UP: '36-plus',
};

export const CONDITION_SLUGS: Record<ProductCondition, string> = {
  PRODUCT_CONDITION_UNSPECIFIED: '',
  PRODUCT_CONDITION_NEW: 'new',
  PRODUCT_CONDITION_PRELOVED: 'preloved',
};

export const SORT_SLUGS: Record<ProductSort, string> = {
  PRODUCT_SORT_PRICE_ASCENDING: 'price_asc',
  PRODUCT_SORT_PRICE_DESCENDING: 'price_desc',
};

/** The enum behind a URL alias, or undefined when the alias is unknown. */
const bySlug = <T extends string>(slugs: Record<T, string>, values: readonly T[]) => {
  const map = new Map(values.map((value) => [slugs[value], value]));
  return (slug: string | null): T | undefined => (slug ? map.get(slug) : undefined);
};

export const ageRangeBySlug = bySlug(AGE_RANGE_SLUGS, AGE_RANGES);
export const conditionBySlug = bySlug(CONDITION_SLUGS, CONDITIONS);
export const sortBySlug = bySlug(SORT_SLUGS, SORT_OPTIONS);

/** Brand the catalog gives toys without a public brand of their own. */
export const OTHERS_BRAND_SLUG = 'others';

/** The shop sells in euros only; the contract prices everything in euro cents. */
export const CURRENCY = 'EUR';

/** Price slider step in euro cents: whole euros. */
export const PRICE_STEP = 100;

/** Catalog price bounds widened to whole slider steps, so both ends stay reachable. */
export const toPriceBounds = (min = 0, max = 0): { min: number; max: number } => ({
  min: Math.floor(min / PRICE_STEP) * PRICE_STEP,
  max: Math.ceil(max / PRICE_STEP) * PRICE_STEP,
});
