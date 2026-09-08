import { useMemo } from 'react';
import { useLocale } from '@/i18n/LocaleContext';
import { buildLinks, type Links } from './routes';

/** Absolute hrefs for the current locale, e.g. links.catalog === '/en/catalog'. */
export function useLinks(): Links {
  const locale = useLocale();
  return useMemo(() => buildLinks(locale), [locale]);
}
