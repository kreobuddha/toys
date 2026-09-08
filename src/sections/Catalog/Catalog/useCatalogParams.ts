import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { IProductsQuery, SortOption } from '@/api/types';

export const PER_PAGE = 12;
const SORTS: SortOption[] = ['newest', 'price_asc', 'price_desc'];

export type CatalogFilters = Omit<IProductsQuery, 'perPage'>;

export interface UpdateOptions {
  replace?: boolean;
}

export interface UseCatalogParamsResult {
  filters: CatalogFilters;
  query: IProductsQuery;
  update: (patch: Partial<CatalogFilters>, options?: UpdateOptions) => void;
  reset: () => void;
  hasFilters: boolean;
}

const isDefaultValue = (key: string, value: unknown): boolean =>
  value === undefined ||
  value === '' ||
  (key === 'page' && value === 1) ||
  (key === 'sort' && value === 'newest');

/**
 * Catalog state lives in the URL so filters survive reload and are shareable.
 * Any filter change resets the page to 1; empty values are dropped from the URL.
 */
export const useCatalogParams = (): UseCatalogParamsResult => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<CatalogFilters>(() => {
    const num = (key: string): number | undefined => {
      const v = Number(searchParams.get(key));
      return Number.isFinite(v) && v > 0 ? v : undefined;
    };
    const sort = searchParams.get('sort') as SortOption | null;
    return {
      page: num('page') ?? 1,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      ageRange: searchParams.get('ageRange') || undefined,
      minPrice: num('minPrice'),
      maxPrice: num('maxPrice'),
      sort: sort && SORTS.includes(sort) ? sort : 'newest',
    };
  }, [searchParams]);

  /**
   * `replace` keeps debounced text input from flooding history; selects and
   * pagination push so the back button walks through catalog states.
   */
  const update = useCallback(
    (patch: Partial<CatalogFilters>, { replace = false }: UpdateOptions = {}): void => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const resetPage = Object.keys(patch).some((k) => k !== 'page');
          if (resetPage) next.delete('page');
          for (const [key, value] of Object.entries(patch)) {
            if (isDefaultValue(key, value)) next.delete(key);
            else next.set(key, String(value));
          }
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const reset = useCallback((): void => setSearchParams({}), [setSearchParams]);

  const query: IProductsQuery = { ...filters, perPage: PER_PAGE };
  const hasFilters = Boolean(
    filters.search || filters.category || filters.ageRange || filters.minPrice || filters.maxPrice
  );

  return { filters, query, update, reset, hasFilters };
};
