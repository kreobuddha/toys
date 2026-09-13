import type { SortOption } from './types';

// Product attribute constants and helpers shared by the UI and the mocks. No React here.

export const SORT_OPTIONS: readonly SortOption[] = ['price_asc', 'price_desc'];

export const isSortOption = (value: string | null): value is SortOption =>
  SORT_OPTIONS.includes(value as SortOption);
