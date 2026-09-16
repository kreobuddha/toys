import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales';

export { useLocale } from './LocaleContext';
export { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale, type Locale } from './locales';
export { formatDate, formatPrice } from './format';

// Resources live in public/locales/<lng>/<ns>.json and are fetched on demand: shared strings in
// translation.json, everything else in the namespace of its section (shopSection, orderSection,
// journalSection, commonSection). A page loads its own namespace with useTranslation.
// The active language follows the /:locale route segment (see LocaleRoute).
void i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    ns: ['translation'],
    // Namespaces are loaded on demand by the components that ask for them.
    defaultNS: 'translation',
    backend: { loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json` },
    interpolation: { escapeValue: false }, // React escapes already
    react: { useSuspense: true },
  });

export default i18n;
