// Draft contract. Adjust once the backend team shares the real API.

export interface Product {
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

export type SortOption = 'price_asc' | 'price_desc' | 'newest';

export interface ProductsQuery {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  ageRange?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
}

export interface Article {
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

export interface OrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
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

export interface CreateOrderResponse {
  orderId: string;
  checkoutUrl: string; // Stripe Checkout session URL
}

export interface SellRequestInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
