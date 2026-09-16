// Catalog types, as the backend sends them (toys.v1.CatalogService). Enum members travel as their
// full protobuf names and fields holding a protobuf default value are left out of the JSON, which
// is why most of them are optional.

export type ProductCategory =
  | 'PRODUCT_CATEGORY_UNSPECIFIED'
  | 'PRODUCT_CATEGORY_BUILDING'
  | 'PRODUCT_CATEGORY_PUZZLES'
  | 'PRODUCT_CATEGORY_SORTERS'
  | 'PRODUCT_CATEGORY_PRACTICAL_LIFE'
  | 'PRODUCT_CATEGORY_PYRAMIDS'
  | 'PRODUCT_CATEGORY_BALANCING';

export type ProductAgeRange =
  | 'PRODUCT_AGE_RANGE_UNSPECIFIED'
  | 'PRODUCT_AGE_RANGE_0_TO_6_MONTHS'
  | 'PRODUCT_AGE_RANGE_6_TO_12_MONTHS'
  | 'PRODUCT_AGE_RANGE_12_TO_18_MONTHS'
  | 'PRODUCT_AGE_RANGE_18_TO_24_MONTHS'
  | 'PRODUCT_AGE_RANGE_2_TO_3_YEARS'
  | 'PRODUCT_AGE_RANGE_3_YEARS_AND_UP';

export type ProductCondition =
  'PRODUCT_CONDITION_UNSPECIFIED' | 'PRODUCT_CONDITION_NEW' | 'PRODUCT_CONDITION_PRELOVED';

export type ProductSort = 'PRODUCT_SORT_PRICE_ASCENDING' | 'PRODUCT_SORT_PRICE_DESCENDING';

export interface IProduct {
  id: number;
  slug: string;
  title: string;
  description?: string;
  /** Euro cents. */
  price?: number;
  imageUrls?: string[];
  category?: ProductCategory;
  ageRange?: ProductAgeRange;
  condition?: ProductCondition;
  /** The contract has no brands yet: every product carries PRODUCT_BRAND_UNSPECIFIED. */
  brand?: string;
  availableQuantity?: number;
}

/**
 * Query parameters of `GET /products`; the gateway names nested request fields with dots. A type
 * alias, not an interface, so it satisfies the `params` record of a request.
 */
export type IProductsParams = {
  page?: number;
  perPage?: number;
  sort?: ProductSort;
  /** Repeated for each selected category. */
  'filter.categories'?: ProductCategory[];
  'filter.ageRange'?: ProductAgeRange;
  'filter.condition'?: ProductCondition;
  'filter.minPrice'?: number;
  'filter.maxPrice'?: number;
};

export interface IListProductsResponse {
  products?: IProduct[];
  page?: number;
  perPage?: number;
  /** Products matching the filters across all pages. */
  total?: number;
}

export interface IGetProductResponse {
  product: IProduct;
}

/** Price bounds in euro cents, used by the shop's price slider. */
export interface IPriceRange {
  min: number;
  max: number;
}
