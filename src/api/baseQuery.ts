import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';

export type QueryParamValue = string | number | boolean | undefined | (string | number)[];

/**
 * One shape for every request in the app:
 * `query: (data) => ({ url, method, params, data })`.
 */
export interface IRequest {
  url: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  /** Query string parameters. An array repeats its parameter, as the REST gateway expects. */
  params?: Record<string, QueryParamValue>;
  /** Request body. */
  data?: unknown;
}

const rawBaseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL });

const toSearch = (params: Record<string, QueryParamValue>): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item));
    } else {
      search.append(key, String(value));
    }
  }
  return search.toString();
};

export const baseQuery: BaseQueryFn<
  IRequest,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = (request, queryApi, extraOptions) => {
  const search = request.params ? toSearch(request.params) : '';
  const args: FetchArgs = {
    url: search ? `${request.url}?${search}` : request.url,
    method: request.method.toUpperCase() as FetchArgs['method'],
    body: request.data,
  };
  return rawBaseQuery(args, queryApi, extraOptions);
};
