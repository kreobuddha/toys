import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Article,
  CreateOrderInput,
  CreateOrderResponse,
  Paginated,
  Product,
  ProductsQuery,
  SellRequestInput,
} from './types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ['Product', 'Article'],
  endpoints: (build) => ({
    getProducts: build.query<Paginated<Product>, ProductsQuery>({
      query: (params) => ({ url: '/products', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProduct: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),
    getArticles: build.query<Article[], void>({
      query: () => '/articles',
      providesTags: [{ type: 'Article', id: 'LIST' }],
    }),
    getArticle: build.query<Article, string>({
      query: (slug) => `/articles/${slug}`,
      providesTags: (_r, _e, slug) => [{ type: 'Article', id: slug }],
    }),
    createOrder: build.mutation<CreateOrderResponse, CreateOrderInput>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
    }),
    sendSellRequest: build.mutation<void, SellRequestInput>({
      query: (body) => ({ url: '/sell-requests', method: 'POST', body }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateOrderMutation,
  useSendSellRequestMutation,
} = api;
