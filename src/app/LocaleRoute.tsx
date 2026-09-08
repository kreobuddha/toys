import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { LocaleContext } from '@/i18n/LocaleContext';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/locales';

const LOCALE_LIKE = /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/;

function looksLikeLocale(segment: string | undefined): segment is string {
  return segment !== undefined && LOCALE_LIKE.test(segment);
}

/**
 * Mounted at /:locale. Validates the prefix and provides the locale to the
 * subtree. A path without a valid locale (/catalog, /xx/about) is redirected to
 * the default locale with the original path preserved (/en/catalog).
 */
export function LocaleRoute() {
  const { locale } = useParams();
  const { pathname, search, hash } = useLocation();
  const valid = isLocale(locale);

  useEffect(() => {
    if (valid) document.documentElement.lang = locale;
  }, [valid, locale]);

  if (!valid) {
    // /xx/about -> /en/about (drop an unsupported language code),
    // /catalog  -> /en/catalog (keep a path that merely lacks the prefix).
    const rest = looksLikeLocale(locale) ? pathname.slice(locale.length + 1) : pathname;
    return <Navigate to={`/${DEFAULT_LOCALE}${rest}${search}${hash}`} replace />;
  }

  return (
    <LocaleContext.Provider value={locale}>
      <Outlet />
    </LocaleContext.Provider>
  );
}
