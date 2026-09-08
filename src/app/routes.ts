import type { Locale } from '@/i18n/locales';

// Route segments relative to the locale prefix. Used both to declare the
// router and, via useLinks(), to build absolute hrefs like /en/catalog/42.
export const paths = {
  home: '',
  catalog: 'catalog',
  product: (id: string | number = ':id') => `catalog/${id}`,
  cart: 'cart',
  checkout: 'checkout',
  orderSuccess: 'order/success',
  sellToys: 'sell',
  blog: 'blog',
  article: (slug = ':slug') => `blog/${slug}`,
  about: 'about',
} as const;

export function localePath(locale: Locale, path = ''): string {
  return path ? `/${locale}/${path}` : `/${locale}`;
}

export function buildLinks(locale: Locale) {
  const to = (p: string) => localePath(locale, p);
  return {
    home: to(paths.home),
    catalog: to(paths.catalog),
    product: (id: string | number) => to(paths.product(id)),
    cart: to(paths.cart),
    checkout: to(paths.checkout),
    orderSuccess: to(paths.orderSuccess),
    sellToys: to(paths.sellToys),
    blog: to(paths.blog),
    article: (slug: string) => to(paths.article(slug)),
    about: to(paths.about),
  };
}

export type Links = ReturnType<typeof buildLinks>;
