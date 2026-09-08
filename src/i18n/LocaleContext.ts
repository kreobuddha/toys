import { createContext, useContext } from 'react';
import { DEFAULT_LOCALE, type Locale } from './locales';

export const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export const useLocale = (): Locale => useContext(LocaleContext);
