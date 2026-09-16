import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ageRangeBySlug,
  AGE_RANGE_SLUGS,
  categoryBySlug,
  CATEGORY_SLUGS,
  conditionBySlug,
  CONDITION_SLUGS,
  sortBySlug,
  SORT_SLUGS,
} from '@/constants/productAttributes';
import type {
  IPriceRange,
  IProductsParams,
  ProductAgeRange,
  ProductCategory,
  ProductCondition,
  ProductSort,
} from '@/types/product';

export const PER_PAGE = 12;

/** Sort used while the URL has none; `null` keeps the backend order. Never written to the URL. */
export const DEFAULT_SORT: ProductSort | null = null;

export type ShopParams = {
  categories: ProductCategory[];
  /** The contract filters by one age range and one condition at a time. */
  ageRange: ProductAgeRange | null;
  condition: ProductCondition | null;
  minPrice?: number;
  maxPrice?: number;
  /** As in the URL; DEFAULT_SORT applies while it is null. */
  sort: ProductSort | null;
  page: number;
};

export interface UpdateOptions {
  replace?: boolean;
}

export interface UseShopParamsResult {
  params: ShopParams;
  requestParams: IProductsParams;
  update: (patch: Partial<ShopParams>, options?: UpdateOptions) => void;
  reset: () => void;
  /** Selected filter values; the price range counts once, the sort not at all. */
  activeCount: number;
}

/** Names of the filter query parameters in the shop URL. */
const URL_PARAMS = { categories: 'category', ageRange: 'age', condition: 'condition' } as const;

const parseInteger = (value: string | null, min: number): number | undefined => {
  if (!value?.trim()) return undefined;
  const number = Number(value);
  return Number.isInteger(number) && number >= min ? number : undefined;
};

/** A comma-separated URL value as categories, without duplicates and in a fixed order. */
const parseCategories = (value: string | null): ProductCategory[] => {
  const slugs = (value ?? '')
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean);
  const categories = slugs
    .map((slug) => categoryBySlug(slug))
    .filter((category): category is ProductCategory => category !== undefined);
  return [...new Set(categories)].sort();
};

/**
 * Shop state from a query string; unknown values are ignored. Once the price bounds are known,
 * prices are clamped to them and an end sitting on its bound is dropped.
 */
const parseParams = (search: string, priceBounds?: IPriceRange): ShopParams => {
  const url = new URLSearchParams(search);
  let minPrice = parseInteger(url.get('minPrice'), 0);
  let maxPrice = parseInteger(url.get('maxPrice'), 0);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }
  if (priceBounds) {
    const clamp = (price: number): number =>
      Math.min(Math.max(price, priceBounds.min), priceBounds.max);
    if (minPrice !== undefined) minPrice = clamp(minPrice);
    if (maxPrice !== undefined) maxPrice = clamp(maxPrice);
    if (minPrice === priceBounds.min) minPrice = undefined;
    if (maxPrice === priceBounds.max) maxPrice = undefined;
  }
  return {
    categories: parseCategories(url.get(URL_PARAMS.categories)),
    ageRange: ageRangeBySlug(url.get(URL_PARAMS.ageRange)) ?? null,
    condition: conditionBySlug(url.get(URL_PARAMS.condition)) ?? null,
    minPrice,
    maxPrice,
    sort: sortBySlug(url.get('sort')) ?? null,
    page: parseInteger(url.get('page'), 1) ?? 1,
  };
};

/**
 * Canonical query string: fixed parameter order, sorted lists, defaults left out. Built by hand
 * because URLSearchParams would turn the list commas into %2C.
 */
const toSearch = (params: ShopParams): string => {
  const parts: string[] = [];
  if (params.categories.length > 0) {
    parts.push(
      `${URL_PARAMS.categories}=${params.categories.map((category) => CATEGORY_SLUGS[category]).join(',')}`
    );
  }
  if (params.ageRange) parts.push(`${URL_PARAMS.ageRange}=${AGE_RANGE_SLUGS[params.ageRange]}`);
  if (params.condition) {
    parts.push(`${URL_PARAMS.condition}=${CONDITION_SLUGS[params.condition]}`);
  }
  if (params.minPrice !== undefined) parts.push(`minPrice=${params.minPrice}`);
  if (params.maxPrice !== undefined) parts.push(`maxPrice=${params.maxPrice}`);
  if (params.sort !== null && params.sort !== DEFAULT_SORT) {
    parts.push(`sort=${SORT_SLUGS[params.sort]}`);
  }
  if (params.page > 1) parts.push(`page=${params.page}`);
  return parts.length > 0 ? `?${parts.join('&')}` : '';
};

/**
 * Shop state lives in the URL so it survives a reload and can be shared. Pass the price bounds so
 * out-of-range prices get clamped.
 */
export const useShopParams = (priceBounds?: IPriceRange): UseShopParamsResult => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => parseParams(search, priceBounds), [search, priceBounds]);

  /**
   * Every change except paging returns to page 1. Checkboxes, sorting and paging push a history
   * entry so Back walks through shop states; the price slider passes `replace`.
   */
  const update = useCallback(
    (patch: Partial<ShopParams>, { replace = false }: UpdateOptions = {}): void => {
      void navigate({ search: toSearch({ ...params, page: 1, ...patch }) }, { replace });
    },
    [navigate, params]
  );

  const reset = useCallback((): void => {
    void navigate({ search: '' });
  }, [navigate]);

  const requestParams = useMemo(
    (): IProductsParams => ({
      page: params.page,
      perPage: PER_PAGE,
      sort: params.sort ?? DEFAULT_SORT ?? undefined,
      'filter.categories': params.categories.length > 0 ? params.categories : undefined,
      'filter.ageRange': params.ageRange ?? undefined,
      'filter.condition': params.condition ?? undefined,
      'filter.minPrice': params.minPrice,
      'filter.maxPrice': params.maxPrice,
    }),
    [params]
  );

  const activeCount =
    params.categories.length +
    (params.ageRange ? 1 : 0) +
    (params.condition ? 1 : 0) +
    (params.minPrice !== undefined || params.maxPrice !== undefined ? 1 : 0);

  return { params, requestParams, update, reset, activeCount };
};
