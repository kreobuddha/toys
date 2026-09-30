import type { Locale } from '@/i18n/locales';

// Route segments relative to the locale prefix. Used both to declare the
// router and, via useLinks(), to build absolute hrefs like /en/shop/rainbow-stacker.
export const paths = {
  home: '',
  shop: 'shop',
  product: (slug = ':slug'): string => `shop/${slug}`,
  checkout: 'checkout',
  orderSuccess: 'order/success',
  sellToUs: 'sell-to-us',
  ourStory: 'our-story',
  journal: 'journal',
  article: (slug = ':slug'): string => `journal/${slug}`,
} as const;

export const localePath = (locale: Locale, path = ''): string =>
  path ? `/${locale}/${path}` : `/${locale}`;

export interface Links {
  home: string;
  shop: string;
  product: (slug: string) => string;
  checkout: string;
  orderSuccess: string;
  sellToUs: string;
  ourStory: string;
  journal: string;
  article: (slug: string) => string;
}

export const buildLinks = (locale: Locale): Links => {
  const to = (p: string): string => localePath(locale, p);
  return {
    home: to(paths.home),
    shop: to(paths.shop),
    product: (slug) => to(paths.product(slug)),
    checkout: to(paths.checkout),
    orderSuccess: to(paths.orderSuccess),
    sellToUs: to(paths.sellToUs),
    ourStory: to(paths.ourStory),
    journal: to(paths.journal),
    article: (slug) => to(paths.article(slug)),
  };
};
