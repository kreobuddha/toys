import type { Locale } from './locales';

export const formatPrice = (minor: number, currency: string, locale: Locale = 'en'): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(minor / 100);
