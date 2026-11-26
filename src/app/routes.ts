import type { Locale } from '@/i18n/locales';

// Route segments relative to the locale prefix. Used both to declare the
// router and, via useLinks(), to build absolute hrefs like /en/shop/rainbow-stacker.
export const paths = {
  home: '',
  shop: 'shop',
  product: (slug = ':slug'): string => `shop/${slug}`,
  checkout: 'checkout',
  // The payment provider returns the customer to one of these two.
  success: 'success',
  paymentError: 'payment-error',
  sellToUs: 'sell-to-us',
  ourStory: 'our-story',
  journal: 'journal',
  article: (slug = ':slug'): string => `journal/${slug}`,
  shipping: 'shipping-and-payment',
  refunds: 'refund-policy',
  terms: 'terms-of-service',
  company: 'company-details',
  privacy: 'privacy-policy',
  cookies: 'cookie-preferences',
} as const;

/** The legal and service pages linked from the footer; each key is a route in `paths`. */
export const LEGAL_PAGES = [
  'shipping',
  'refunds',
  'terms',
  'company',
  'privacy',
  'cookies',
] as const;

export type LegalPage = (typeof LEGAL_PAGES)[number];

export const localePath = (locale: Locale, path = ''): string =>
  path ? `/${locale}/${path}` : `/${locale}`;

export interface Links {
  home: string;
  shop: string;
  product: (slug: string) => string;
  checkout: string;
  success: string;
  paymentError: string;
  sellToUs: string;
  ourStory: string;
  journal: string;
  article: (slug: string) => string;
  legal: Record<LegalPage, string>;
}

export const buildLinks = (locale: Locale): Links => {
  const to = (p: string): string => localePath(locale, p);
  return {
    home: to(paths.home),
    shop: to(paths.shop),
    product: (slug) => to(paths.product(slug)),
    checkout: to(paths.checkout),
    success: to(paths.success),
    paymentError: to(paths.paymentError),
    sellToUs: to(paths.sellToUs),
    ourStory: to(paths.ourStory),
    journal: to(paths.journal),
    article: (slug) => to(paths.article(slug)),
    legal: {
      shipping: to(paths.shipping),
      refunds: to(paths.refunds),
      terms: to(paths.terms),
      company: to(paths.company),
      privacy: to(paths.privacy),
      cookies: to(paths.cookies),
    },
  };
};

/** What a route tells the layout through its `handle`. */
export interface IRouteHandle {
  /** Seed of the falling toys background behind the page and the footer; none when absent. */
  backgroundSeed?: number;
}
