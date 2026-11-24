import type { INlCity } from '@/types/nlAddress';

const STORAGE_KEY = 'toys.checkout.city';

// Most customers are in Amsterdam; 3594 is its woonplaatscode in the BAG.
export const DEFAULT_CITY: INlCity = { name: 'Amsterdam', code: '3594' };

const isCity = (value: unknown): value is INlCity => {
  if (typeof value !== 'object' || value === null) return false;
  const { name, code } = value as Partial<INlCity>;
  return typeof name === 'string' && name !== '' && typeof code === 'string' && code !== '';
};

/** The city the customer confirmed last time, if the browser kept it. */
export const loadSavedCity = (): INlCity | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const value: unknown = raw ? JSON.parse(raw) : undefined;
    return isCity(value) ? { name: value.name, code: value.code } : undefined;
  } catch {
    return undefined;
  }
};

export const saveCity = (city: INlCity): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: city.name, code: city.code }));
  } catch {
    // storage unavailable (private mode etc.): the choice lasts for this visit only
  }
};
