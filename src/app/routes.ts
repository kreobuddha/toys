export const routes = {
  home: '/',
  catalog: '/catalog',
  product: (id: string | number = ':id') => `/catalog/${id}`,
  cart: '/cart',
  checkout: '/checkout',
  orderSuccess: '/order/success',
  sellToys: '/sell',
  blog: '/blog',
  article: (slug = ':slug') => `/blog/${slug}`,
  about: '/about',
} as const;
