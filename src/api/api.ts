import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  IArticle,
  ICatalogFacets,
  ICreateOrderInput,
  ICreateOrderResponse,
  IPaginated,
  IProduct,
  IProductsQuery,
  ISellRequestInput,
} from './types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ['Product', 'Article'],
  endpoints: (build) => ({
    getProducts: build.query<IPaginated<IProduct>, IProductsQuery>({
      query: (params) => ({ url: '/products', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getCatalogFacets: build.query<ICatalogFacets, void>({
      query: () => '/products/facets',
    }),
    getProduct: build.query<IProduct, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),
    getArticles: build.query<IArticle[], void>({
      query: () => '/articles',
      providesTags: [{ type: 'Article', id: 'LIST' }],
    }),
    getArticle: build.query<IArticle, string>({
      query: (slug) => `/articles/${slug}`,
      providesTags: (_r, _e, slug) => [{ type: 'Article', id: slug }],
    }),
    createOrder: build.mutation<ICreateOrderResponse, ICreateOrderInput>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
    }),
    sendSellRequest: build.mutation<void, ISellRequestInput>({
      query: (body) => ({ url: '/sell-requests', method: 'POST', body }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCatalogFacetsQuery,
  useGetProductQuery,
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateOrderMutation,
  useSendSellRequestMutation,
} = api;
