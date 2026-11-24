import { fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { api } from '@/api/api';
import type {
  INlCitySuggestion,
  INlStreetQuery,
  INlStreetSuggestion,
  IPdokCity,
  IPdokResponse,
  IPdokStreet,
} from '@/types/pdok';

// PDOK Locatieserver: the government's free search over the BAG address register, no key, CORS
// open. Findings: docs/research/nl-address-autocomplete.md.
//
// This is a third-party Solr API, not our backend, so its rows are reshaped here in `queryFn`
// rather than left as they arrive.
const PDOK_URL = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1';

// A base query of its own, so headers the shop API adds later (auth) never reach PDOK.
const pdokBaseQuery = fetchBaseQuery({ baseUrl: PDOK_URL });

const UNEXPECTED_RESPONSE: FetchBaseQueryError = {
  status: 'CUSTOM_ERROR',
  error: 'Unexpected PDOK response',
};

/** A `/suggest` path; `fq` repeats, which a params object cannot express. */
const suggestPath = (q: string, filters: string[], fields: string[], rows: number): string => {
  const params = new URLSearchParams({ q, fl: fields.join(','), rows: String(rows) });
  for (const filter of filters) params.append('fq', filter);
  return `/suggest?${params}`;
};

/** Solr's corrected query for a search without hits: "herengraht 611" → "herengracht 611". */
const collationQuery = (body: IPdokResponse<unknown>): string | undefined => {
  const collation = body.spellcheck?.collations?.find(
    (item): item is { collationQuery: string } =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as { collationQuery?: unknown }).collationQuery === 'string'
  );
  return collation?.collationQuery;
};

/** Each street name once, in the order PDOK ranked them. */
const toStreetNames = (docs: IPdokStreet[]): INlStreetSuggestion[] =>
  [...new Set(docs.map((doc) => doc.straatnaam))].map((street) => ({ street, postcodes: [] }));

/** One row per street and house number in ranking order; letters and additions fold into it. */
const toHouseNumbers = (docs: IPdokStreet[]): INlStreetSuggestion[] => {
  const rows = new Map<string, INlStreetSuggestion>();
  for (const doc of docs) {
    if (doc.huisnummer === undefined) continue;
    const key = `${doc.straatnaam}|${doc.huisnummer}`;
    const row = rows.get(key) ?? {
      street: doc.straatnaam,
      houseNumber: doc.huisnummer,
      postcodes: [],
    };
    if (doc.postcode && !row.postcodes.includes(doc.postcode)) row.postcodes.push(doc.postcode);
    rows.set(key, row);
  }
  return [...rows.values()];
};

export const pdokApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** Localities for typed text; pass it trimmed and lower-cased so equal input shares the cache. */
    suggestNlCities: build.query<INlCitySuggestion[], string>({
      queryFn: async (q, queryApi, extraOptions) => {
        const path = suggestPath(
          q,
          ['type:woonplaats'],
          ['woonplaatsnaam', 'woonplaatscode', 'gemeentenaam', 'provincienaam'],
          10
        );
        const result = await pdokBaseQuery(path, queryApi, extraOptions);
        if (result.error) return { error: result.error };
        const docs = (result.data as IPdokResponse<IPdokCity>).response?.docs;
        if (!docs) return { error: UNEXPECTED_RESPONSE };
        const cities = docs.map((doc) => ({
          name: doc.woonplaatsnaam,
          code: doc.woonplaatscode,
          municipality: doc.gemeentenaam,
          province: doc.provincienaam,
        }));
        // PDOK also matches municipality and province words ("amst" finds Weesp), so names that
        // start with the typed text go first.
        const startsWithQuery = (city: INlCitySuggestion): boolean =>
          city.name.toLowerCase().startsWith(q);
        return {
          data: [...cities.filter(startsWithQuery), ...cities.filter((c) => !startsWithQuery(c))],
        };
      },
    }),
    /**
     * Street names within a city, or one row per house number once the line has a number. Without
     * a number PDOK returns a street's addresses in no useful order, so names come first.
     */
    suggestNlStreets: build.query<INlStreetSuggestion[], INlStreetQuery>({
      queryFn: async ({ cityCode, street, houseNumber }, queryApi, extraOptions) => {
        const byNumber = houseNumber !== undefined;
        const filters = [byNumber ? 'type:adres' : 'type:weg', `woonplaatscode:${cityCode}`];
        const fields = byNumber ? ['straatnaam', 'huisnummer', 'postcode'] : ['straatnaam'];
        const request = (q: string): ReturnType<typeof pdokBaseQuery> =>
          pdokBaseQuery(
            suggestPath(q, filters, fields, byNumber ? 50 : 10),
            queryApi,
            extraOptions
          );

        let result = await request(byNumber ? `${street} ${houseNumber}` : street);
        if (result.error) return { error: result.error };
        let body = result.data as IPdokResponse<IPdokStreet>;
        // No fuzzy matching, but a search without hits comes with a corrected query.
        const corrected = body.response?.numFound === 0 ? collationQuery(body) : undefined;
        if (corrected) {
          result = await request(corrected);
          if (result.error) return { error: result.error };
          body = result.data as IPdokResponse<IPdokStreet>;
        }
        const docs = body.response?.docs;
        if (!docs) return { error: UNEXPECTED_RESPONSE };
        return { data: byNumber ? toHouseNumbers(docs) : toStreetNames(docs) };
      },
    }),
  }),
});

export const { useSuggestNlCitiesQuery, useLazySuggestNlCitiesQuery, useSuggestNlStreetsQuery } =
  pdokApi;
