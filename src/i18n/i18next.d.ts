import 'i18next';
import type translation from '../../public/locales/en/translation.json';
import type commonSection from '../../public/locales/en/commonSection.json';
import type journalSection from '../../public/locales/en/journalSection.json';
import type orderSection from '../../public/locales/en/orderSection.json';
import type shopSection from '../../public/locales/en/shopSection.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof translation;
      commonSection: typeof commonSection;
      journalSection: typeof journalSection;
      orderSection: typeof orderSection;
      shopSection: typeof shopSection;
    };
  }
}
