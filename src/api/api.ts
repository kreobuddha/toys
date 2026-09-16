import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

/**
 * Empty root API. Endpoints live next to the section that uses them and attach themselves with
 * `api.injectEndpoints` (`src/sections/<Section>/api`), so this file never grows.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'Article'],
  endpoints: () => ({}),
});
