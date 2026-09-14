import { fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { api } from './api';
import type { INlCity } from './nlAddress';

// PDOK Locatieserver: the government's free search over the BAG address register, no key, CORS
// open. Findings: docs/research/nl-address-autocomplete.md.
const PDOK_URL = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1';

// A base query of its own, so headers the shop API adds later (auth) never reach PDOK.
const pdokBaseQuery = fetchBaseQuery({ baseUrl: PDOK_URL });

const UNEXPECTED_RESPONSE: FetchBaseQueryError = {
  status: 'CUSTOM_ERROR',
  error: 'Unexpected PDOK response',
};

export interface INlCitySuggestion extends INlCity {
  municipality: string;
  province: string;
}

interface IPdokResponse<Doc> {
  response?: { numFound: number; docs: Doc[] };
}

interface IPdokCity {
  woonplaatsnaam: string;
  woonplaatscode: string;
  gemeentenaam: string;
  provincienaam: string;
}

/** A `/suggest` path; `fq` repeats, which a params object cannot express. */
const suggestPath = (q: string, filters: string[], fields: string[], rows: number): string => {
  const params = new URLSearchParams({ q, fl: fields.join(','), rows: String(rows) });
  for (const filter of filters) params.append('fq', filter);
  return `/suggest?${params}`;
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
  }),
});

export const { useSuggestNlCitiesQuery, useLazySuggestNlCitiesQuery } = pdokApi;
