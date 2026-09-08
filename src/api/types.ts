// Draft contract. Adjust once the backend team shares the real API.

export interface IProduct {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number; // minor units (cents)
  currency: string;
  images: string[];
  category: string;
  ageRange?: string;
  condition?: string;
  inStock: boolean;
  articleSlug?: string; // related blog article
}

export interface ICatalogFacets {
  categories: string[];
  ageRanges: string[];
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest';

export interface IProductsQuery {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  ageRange?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
}

export interface IPaginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
}

export interface IArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  publishedAt: string;
  blocks: ArticleBlock[];
}

export type ArticleBlock =
  | { type: 'text'; html: string }
  | { type: 'image'; src: string; alt?: string; caption?: string }
  | { type: 'quote'; text: string; author?: string };

export type DeliveryMethod = 'pickup' | 'courier' | 'post';

export interface IOrderItemInput {
  productId: number;
  quantity: number;
}

export interface ICreateOrderInput {
  items: IOrderItemInput[];
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  delivery: {
    method: DeliveryMethod;
    address?: string;
  };
}

export interface ICreateOrderResponse {
  orderId: string;
  checkoutUrl: string; // Stripe Checkout session URL
}

export interface ISellRequestInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
