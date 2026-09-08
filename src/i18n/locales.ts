export const SUPPORTED_LOCALES = ['en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const isLocale = (value: string | undefined): value is Locale =>
  (SUPPORTED_LOCALES as readonly string[]).includes(value ?? '');
