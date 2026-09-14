import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from './api';
import type { INlAddressLookup, INlAddressOption, INlAddressQuery } from './nlAddress';

// PDOK Locatieserver: the government's free address search over the BAG, no key, CORS open.
// Findings and alternatives: docs/research/nl-address-autocomplete.md.
const PDOK_URL = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1';
const FIELDS = 'straatnaam,huisnummer,huisletter,huisnummertoevoeging,postcode,woonplaatsnaam';
const MAX_ROWS = 100; // PDOK answers 400 above this

// A base query of its own, so headers the shop API adds later (auth) never reach PDOK.
const pdokBaseQuery = fetchBaseQuery({ baseUrl: PDOK_URL });

interface IPdokAddress {
  straatnaam: string;
  huisnummer: number;
  huisletter?: string;
  huisnummertoevoeging?: string;
  postcode: string;
  woonplaatsnaam: string;
}

interface IPdokResponse {
  response?: { numFound: number; docs: IPdokAddress[] };
}

const toOption = (doc: IPdokAddress): INlAddressOption => {
  const letter = doc.huisletter ?? '';
  const extra = doc.huisnummertoevoeging;
  return {
    address: {
      postcode: doc.postcode,
      houseNumber: doc.huisnummer,
      addition: `${letter}${extra ? `${letter ? '-' : ''}${extra}` : ''}` || undefined,
      street: doc.straatnaam,
      city: doc.woonplaatsnaam,
      country: 'NL',
    },
    line: `${doc.straatnaam} ${doc.huisnummer}${letter}${extra ? `-${extra}` : ''}`,
  };
};

export const pdokApi = api.injectEndpoints({
  endpoints: (build) => ({
    lookupNlAddress: build.query<INlAddressLookup, INlAddressQuery>({
      queryFn: async ({ postcode, houseNumber }, queryApi, extraOptions) => {
        const params = new URLSearchParams({ q: '*', fl: FIELDS, rows: String(MAX_ROWS) });
        // `fq` repeats, which a params object cannot express.
        for (const filter of ['type:adres', `postcode:${postcode}`, `huisnummer:${houseNumber}`]) {
          params.append('fq', filter);
        }
        const result = await pdokBaseQuery(`/free?${params}`, queryApi, extraOptions);
        if (result.error) return { error: result.error };
        const response = (result.data as IPdokResponse).response;
        if (!response) {
          return { error: { status: 'CUSTOM_ERROR', error: 'Unexpected PDOK response' } };
        }
        // The search is fuzzy: keep only exact matches of postcode and house number.
        const options = response.docs
          .filter((doc) => doc.postcode === postcode && doc.huisnummer === houseNumber)
          .map(toOption);
        return { data: { options, truncated: response.numFound > response.docs.length } };
      },
    }),
  }),
});

export const { useLookupNlAddressQuery, useLazyLookupNlAddressQuery } = pdokApi;
