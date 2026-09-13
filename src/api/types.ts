// Draft contract. Adjust once the backend team shares the real API.

export type AgeGroup = '0-6' | '6-12' | '12-18' | '18-24' | '24-36' | '36-plus'; // months

export type Condition = 'new' | 'excellent' | 'good';

export interface ICategory {
  slug: string;
  name: string;
}

export interface IBrand {
  slug: string;
  name: string;
}

export interface IProduct {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number; // minor units (cents)
  currency: string;
  images: string[];
  category: ICategory;
  brand?: IBrand; // absent for unbranded toys
  condition: Condition;
  ageGroups: AgeGroup[]; // every group the toy suits
  inStock: boolean;
  articleSlug?: string; // related journal article
}

export interface IPriceRange {
  min: number; // minor units
  max: number;
}

export interface IProductFacets {
  categories: ICategory[];
  brands: IBrand[];
  price: IPriceRange; // across all products
}

export type SortOption = 'price_asc' | 'price_desc';

/**
 * Sent as query parameters; lists go comma-separated under the names in LIST_PARAMS
 * (src/api/productAttributes.ts) and are left out when empty.
 */
export interface IProductsQuery {
  categories?: string[]; // category slugs
  brands?: string[]; // brand slugs; 'other' matches products without a brand
  ageGroups?: AgeGroup[]; // matches toys that suit any of the groups
  conditions?: Condition[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption; // omitted: the backend's default order
  page?: number;
  perPage?: number;
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

/** Delivery address; the shop delivers within the Netherlands only. */
export interface INlAddress {
  postcode: string; // "1012JS": no space, upper case
  houseNumber: number;
  addition?: string; // house letter and/or addition: "B", "1A", "A-2"
  street: string;
  city: string;
  country: 'NL';
}

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
    address?: INlAddress; // courier and post only; the backend must validate it again
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
