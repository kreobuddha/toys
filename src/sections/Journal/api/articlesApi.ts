import { api } from '@/api/api';
import type {
  IGetArticleResponse,
  IListArticlesParams,
  IListArticlesResponse,
} from '@/types/article';

export const articlesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getArticles: build.query<IListArticlesResponse, IListArticlesParams>({
      query: (data) => ({ url: '/articles', method: 'get', params: data }),
      providesTags: [{ type: 'Article', id: 'LIST' }],
    }),
    getArticle: build.query<IGetArticleResponse, string>({
      query: (slug) => ({ url: `/articles/${slug}`, method: 'get' }),
      providesTags: (_result, _error, slug) => [{ type: 'Article', id: slug }],
    }),
  }),
});

export const { useGetArticlesQuery, useGetArticleQuery } = articlesApi;
