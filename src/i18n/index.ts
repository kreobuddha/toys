import { en, type Messages } from './en';
import { useLocale } from './LocaleContext';
import type { Locale } from './locales';

export { useLocale } from './LocaleContext';
export { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale, type Locale } from './locales';

// Adding a locale: add it to SUPPORTED_LOCALES, add a messages file here.
// Components never touch this map — they call useT().
const messages: Record<Locale, Messages> = { en };

export function useT(): Messages {
  return messages[useLocale()];
}

export function formatPrice(minor: number, currency: string, locale: Locale = 'en'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(minor / 100);
}
