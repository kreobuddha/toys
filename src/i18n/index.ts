import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales';

export { useLocale } from './LocaleContext';
export { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale, type Locale } from './locales';
export { formatDate, formatPrice } from './format';

// Resources live in public/locales/<lng>/<ns>.json and are fetched on demand.
// The active language follows the /:locale route segment (see LocaleRoute).
void i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    ns: ['translation'],
    defaultNS: 'translation',
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    interpolation: { escapeValue: false }, // React escapes already
    react: { useSuspense: true },
  });

export default i18n;
