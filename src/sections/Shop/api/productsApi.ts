import { api } from '@/api/api';
import type {
  IGetProductFacetsResponse,
  IGetProductResponse,
  IListProductsResponse,
  IProductsParams,
} from '@/types/product';

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<IListProductsResponse, IProductsParams>({
      query: (data) => ({ url: '/products', method: 'get', params: data }),
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProduct: build.query<IGetProductResponse, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'get' }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    /** Everything the filter panel offers: categories, brands, age ranges, conditions, prices. */
    getProductFacets: build.query<IGetProductFacetsResponse, void>({
      query: () => ({ url: '/product-facets', method: 'get' }),
      providesTags: [{ type: 'Product', id: 'FACETS' }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery, useGetProductFacetsQuery } = productsApi;
