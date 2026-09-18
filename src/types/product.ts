// Catalog types, as the backend sends them (toys.v1.CatalogService). Enum members travel as their
// full protobuf names and fields holding a protobuf default value are left out of the JSON, which
// is why most of them are optional.

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

export interface IProductCategory {
  /** Stable, URL-safe value; it is what the filter and the shop URL carry. */
  slug: string;
  name: string;
}

export interface IProductBrand {
  slug: string;
  name: string;
}

export interface IProduct {
  id: number;
  slug: string;
  title: string;
  description?: string;
  /** Euro cents. */
  price?: number;
  imageUrls?: string[];
  categories?: IProductCategory[];
  ageRanges?: ProductAgeRange[];
  condition?: ProductCondition;
  /** Toys without a public brand carry the reserved "others" brand rather than no brand. */
  brand?: IProductBrand;
  availableQuantity?: number;
}

/**
 * Query parameters of `GET /products`; the gateway names nested request fields with dots and
 * repeats a parameter for each value of a list. A type alias, not an interface, so it satisfies
 * the `params` record of a request.
 */
export type IProductsParams = {
  page?: number;
  perPage?: number;
  sort?: ProductSort;
  'filter.categorySlugs'?: string[];
  'filter.brandSlugs'?: string[];
  'filter.ageRanges'?: ProductAgeRange[];
  'filter.conditions'?: ProductCondition[];
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

export interface IProductCategoryFacet {
  category: IProductCategory;
  /** Products in this category across the whole catalog. */
  productCount?: number;
}

export interface IProductBrandFacet {
  brand: IProductBrand;
  productCount?: number;
}

export interface IProductAgeRangeFacet {
  ageRange: ProductAgeRange;
  /** The backend's own name; the shop shows its own localized label instead. */
  name?: string;
  productCount?: number;
}

export interface IProductConditionFacet {
  condition: ProductCondition;
  name?: string;
  productCount?: number;
}

/** Everything the filter panel offers, with the catalog's own price bounds. */
export interface IGetProductFacetsResponse {
  categories?: IProductCategoryFacet[];
  brands?: IProductBrandFacet[];
  ageRanges?: IProductAgeRangeFacet[];
  conditions?: IProductConditionFacet[];
  minPrice?: number; // euro cents
  maxPrice?: number;
}

/** Price bounds in euro cents, used by the shop's price slider. */
export interface IPriceRange {
  min: number;
  max: number;
}
