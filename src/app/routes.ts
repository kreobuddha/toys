import type { Locale } from '@/i18n/locales';

// Route segments relative to the locale prefix. Used both to declare the
// router and, via useLinks(), to build absolute hrefs like /en/catalog/42.
export const paths = {
  home: '',
  catalog: 'catalog',
  product: (id: string | number = ':id'): string => `catalog/${id}`,
  checkout: 'checkout',
  orderSuccess: 'order/success',
  sellToys: 'sell',
  blog: 'blog',
  article: (slug = ':slug'): string => `blog/${slug}`,
  about: 'about',
} as const;

export const localePath = (locale: Locale, path = ''): string =>
  path ? `/${locale}/${path}` : `/${locale}`;

export interface Links {
  home: string;
  catalog: string;
  product: (id: string | number) => string;
  checkout: string;
  orderSuccess: string;
  sellToys: string;
  blog: string;
  article: (slug: string) => string;
  about: string;
}

export const buildLinks = (locale: Locale): Links => {
  const to = (p: string): string => localePath(locale, p);
  return {
    home: to(paths.home),
    catalog: to(paths.catalog),
    product: (id) => to(paths.product(id)),
    checkout: to(paths.checkout),
    orderSuccess: to(paths.orderSuccess),
    sellToys: to(paths.sellToys),
    blog: to(paths.blog),
    article: (slug) => to(paths.article(slug)),
    about: to(paths.about),
  };
};
