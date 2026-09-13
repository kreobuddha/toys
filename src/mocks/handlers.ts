import { delay, http, HttpResponse } from 'msw';
import { isNlPostcode } from '@/api/nlAddress';
import {
  isAgeGroup,
  isCondition,
  isSortOption,
  LIST_PARAMS,
  OTHER_BRAND,
  parseList,
} from '@/api/productAttributes';
import type {
  ISellRequestInput,
  ICreateOrderInput,
  ICreateOrderResponse,
  IPaginated,
  IProduct,
  IProductFacets,
  SortOption,
} from '@/api/types';
import { BRANDS, CATEGORIES, products } from './data/products';
import { articles } from './data/articles';

const API = import.meta.env.VITE_API_URL;

// Simulated network latency on every mocked request, so loading states are visible.
const RESPONSE_DELAY_MS = 1000;

const SORTERS: Record<SortOption, (a: IProduct, b: IProduct) => number> = {
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
};

// Without `sort` the backend keeps its own default order; the mock lists newest first.
const NEWEST_FIRST = (a: IProduct, b: IProduct): number => b.id - a.id;

export const handlers = [
  http.get(`${API}/products`, async ({ request }) => {
    const q = new URL(request.url).searchParams;
    const categories = parseList(q.get(LIST_PARAMS.categories));
    const brands = parseList(q.get(LIST_PARAMS.brands));
    const ageGroups = parseList(q.get(LIST_PARAMS.ageGroups)).filter(isAgeGroup);
    const conditions = parseList(q.get(LIST_PARAMS.conditions)).filter(isCondition);
    const minPrice = Number(q.get('minPrice') ?? 0);
    const maxPrice = Number(q.get('maxPrice') ?? Infinity);
    const sort = q.get('sort');
    const page = Math.max(1, Number(q.get('page') ?? 1));
    const perPage = Math.max(1, Number(q.get('perPage') ?? 12));

    const filtered = products
      .filter((p) => !categories.length || categories.includes(p.category.slug))
      .filter((p) => !brands.length || brands.includes(p.brand?.slug ?? OTHER_BRAND))
      // A toy matches the age filter when it suits any of the requested groups.
      .filter((p) => !ageGroups.length || p.ageGroups.some((group) => ageGroups.includes(group)))
      .filter((p) => !conditions.length || conditions.includes(p.condition))
      .filter((p) => p.price >= minPrice && p.price <= maxPrice)
      .sort(isSortOption(sort) ? SORTERS[sort] : NEWEST_FIRST);

    const start = (page - 1) * perPage;
    const body: IPaginated<IProduct> = {
      items: filtered.slice(start, start + perPage),
      page,
      perPage,
      total: filtered.length,
    };
    await delay(RESPONSE_DELAY_MS);
    return HttpResponse.json(body);
  }),

  http.get(`${API}/products/facets`, async () => {
    const prices = products.map((p) => p.price);
    const body: IProductFacets = {
      categories: CATEGORIES,
      brands: BRANDS,
      price: { min: Math.min(...prices), max: Math.max(...prices) },
    };
    await delay(RESPONSE_DELAY_MS);
    return HttpResponse.json(body);
  }),

  http.get(`${API}/products/:id`, async ({ params }) => {
    const product = products.find((p) => String(p.id) === params.id);
    await delay(RESPONSE_DELAY_MS);
    return product ? HttpResponse.json(product) : new HttpResponse(null, { status: 404 });
  }),

  http.get(`${API}/articles`, async () => {
    await delay(RESPONSE_DELAY_MS);
    // List payload carries no blocks; the article endpoint returns the full body.
    const list = [...articles]
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .map((article) => ({ ...article, blocks: [] }));
    return HttpResponse.json(list);
  }),

  http.get(`${API}/articles/:slug`, async ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    await delay(RESPONSE_DELAY_MS);
    return article ? HttpResponse.json(article) : new HttpResponse(null, { status: 404 });
  }),

  http.post(`${API}/orders`, async ({ request }) => {
    const input = (await request.json()) as ICreateOrderInput;
    await delay(RESPONSE_DELAY_MS);
    if (!input.items?.length || !input.contact?.email) {
      return new HttpResponse(null, { status: 400 });
    }
    // The real backend checks the address against the BAG; the mock only turns away
    // addresses outside the Netherlands.
    const address = input.delivery?.address;
    if (address && (address.country !== 'NL' || !isNlPostcode(address.postcode))) {
      return new HttpResponse(null, { status: 422 });
    }
    const orderId = `TOY-${String(Date.now()).slice(-6)}`;
    // The real backend returns a Stripe Checkout URL; the mock sends the user
    // straight to the success page so the flow can be exercised end to end.
    const body: ICreateOrderResponse = {
      orderId,
      checkoutUrl: `${location.origin}${import.meta.env.BASE_URL}en/order/success?order=${orderId}`,
    };
    return HttpResponse.json(body, { status: 201 });
  }),

  http.post(`${API}/sell-requests`, async ({ request }) => {
    const input = (await request.json()) as ISellRequestInput;
    await delay(RESPONSE_DELAY_MS);
    if (!input.email || !input.message) return new HttpResponse(null, { status: 400 });
    return new HttpResponse(null, { status: 201 });
  }),
];
