export const en = {
  nav: {
    home: 'Home',
    catalog: 'Catalog',
    sell: 'Sell toys',
    blog: 'Blog',
    about: 'About',
    cart: 'Cart',
  },
  common: {
    loading: 'Loading…',
    error: 'Something went wrong. Please try again.',
    addToCart: 'Add to cart',
    notFound: 'Page not found',
  },
  footer: {
    rights: 'All rights reserved.',
  },
} as const;

export type Messages = typeof en;
