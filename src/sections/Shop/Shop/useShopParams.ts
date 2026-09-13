import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  isAgeGroup,
  isCondition,
  isSortOption,
  LIST_PARAMS,
  normalizeList,
  parseList,
  type ListKey,
} from '@/api/productAttributes';
import type { AgeGroup, Condition, IPriceRange, IProductsQuery, SortOption } from '@/api/types';

export const PER_PAGE = 12;

/** Sort used while the URL has none; `null` keeps the backend order. Never written to the URL. */
export const DEFAULT_SORT: SortOption | null = null;

export type ShopParams = {
  categories: string[];
  brands: string[];
  ageGroups: AgeGroup[];
  conditions: Condition[];
  minPrice?: number;
  maxPrice?: number;
  /** As in the URL; DEFAULT_SORT applies while it is null. */
  sort: SortOption | null;
  page: number;
};

export interface UpdateOptions {
  replace?: boolean;
}

export interface UseShopParamsResult {
  params: ShopParams;
  query: IProductsQuery;
  update: (patch: Partial<ShopParams>, options?: UpdateOptions) => void;
  reset: () => void;
  /** Selected filter values; the price range counts once, the sort not at all. */
  activeCount: number;
}

const LIST_KEYS = Object.keys(LIST_PARAMS) as ListKey[];

const parseInteger = (value: string | null, min: number): number | undefined => {
  if (!value?.trim()) return undefined;
  const number = Number(value);
  return Number.isInteger(number) && number >= min ? number : undefined;
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
  const sort = url.get('sort');
  return {
    categories: parseList(url.get(LIST_PARAMS.categories)),
    brands: parseList(url.get(LIST_PARAMS.brands)),
    ageGroups: parseList(url.get(LIST_PARAMS.ageGroups)).filter(isAgeGroup),
    conditions: parseList(url.get(LIST_PARAMS.conditions)).filter(isCondition),
    minPrice,
    maxPrice,
    sort: isSortOption(sort) ? sort : null,
    page: parseInteger(url.get('page'), 1) ?? 1,
  };
};

/**
 * Canonical query string: fixed parameter order, sorted lists, defaults left out. Built by hand
 * because URLSearchParams would turn the list commas into %2C.
 */
const toSearch = (params: ShopParams): string => {
  const parts: string[] = [];
  for (const key of LIST_KEYS) {
    const values = normalizeList<string>(params[key]);
    if (values.length > 0) {
      parts.push(`${LIST_PARAMS[key]}=${values.map(encodeURIComponent).join(',')}`);
    }
  }
  if (params.minPrice !== undefined) parts.push(`minPrice=${params.minPrice}`);
  if (params.maxPrice !== undefined) parts.push(`maxPrice=${params.maxPrice}`);
  if (params.sort !== null && params.sort !== DEFAULT_SORT) parts.push(`sort=${params.sort}`);
  if (params.page > 1) parts.push(`page=${params.page}`);
  return parts.length > 0 ? `?${parts.join('&')}` : '';
};

/**
 * Shop state lives in the URL so it survives a reload and can be shared. Pass the price bounds
 * once the facets are loaded so out-of-range prices get clamped.
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

  const query = useMemo((): IProductsQuery => {
    const { sort, ...filters } = params;
    return { ...filters, sort: sort ?? DEFAULT_SORT ?? undefined, perPage: PER_PAGE };
  }, [params]);

  const activeCount =
    LIST_KEYS.reduce((count, key) => count + params[key].length, 0) +
    (params.minPrice !== undefined || params.maxPrice !== undefined ? 1 : 0);

  return { params, query, update, reset, activeCount };
};
