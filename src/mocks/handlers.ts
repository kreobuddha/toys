import { delay, http, HttpResponse } from 'msw';
import type {
  ISellRequestInput,
  ICreateOrderInput,
  ICreateOrderResponse,
  IPaginated,
  IProduct,
  SortOption,
} from '@/api/types';
import { AGE_RANGES, CATEGORIES, products } from './data/products';
import { articles } from './data/articles';

const API = import.meta.env.VITE_API_URL;

// Simulated network latency on every mocked request, so loading states are visible.
const RESPONSE_DELAY_MS = 1000;

const SORTERS: Record<SortOption, (a: IProduct, b: IProduct) => number> = {
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  newest: (a, b) => b.id - a.id,
};

export const handlers = [
  http.get(`${API}/products`, async ({ request }) => {
    const q = new URL(request.url).searchParams;
    const search = q.get('search')?.trim().toLowerCase();
    const category = q.get('category');
    const ageRange = q.get('ageRange');
    const minPrice = Number(q.get('minPrice') ?? 0);
    const maxPrice = Number(q.get('maxPrice') ?? Infinity);
    const sort = (q.get('sort') ?? 'newest') as SortOption;
    const page = Math.max(1, Number(q.get('page') ?? 1));
    const perPage = Math.max(1, Number(q.get('perPage') ?? 12));

    const filtered = products
      .filter((p) => !search || p.title.toLowerCase().includes(search))
      .filter((p) => !category || p.category === category)
      .filter((p) => !ageRange || p.ageRange === ageRange)
      .filter((p) => p.price >= minPrice && p.price <= maxPrice)
      .sort(SORTERS[sort] ?? SORTERS.newest);

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
    await delay(RESPONSE_DELAY_MS);
    return HttpResponse.json({ categories: [...CATEGORIES], ageRanges: [...AGE_RANGES] });
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
    const orderId = `TOY-${String(Date.now()).slice(-6)}`;
    // The real backend returns a Stripe Checkout URL; the mock sends the user
    // straight to the success page so the flow can be exercised end to end.
    const body: ICreateOrderResponse = {
      orderId,
      checkoutUrl: `${location.origin}/en/order/success?order=${orderId}`,
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
