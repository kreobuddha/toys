import { en, type Messages } from './en';

// Minimal i18n seam: the app is English-only for now, but every string goes
// through useT() so adding a locale later means adding a messages file and a
// locale switch here, not touching components.
const messages: Record<string, Messages> = { en };
const currentLocale = 'en';

export function useT(): Messages {
  return messages[currentLocale];
}

export function formatPrice(minor: number, currency: string, locale = 'en'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(minor / 100);
}
