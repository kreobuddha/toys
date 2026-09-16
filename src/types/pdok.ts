// PDOK Locatieserver: the Dutch government's free search over the BAG address register.
// Findings: docs/research/nl-address-autocomplete.md.

import type { INlCity } from './nlAddress';

export interface INlCitySuggestion extends INlCity {
  municipality: string;
  province: string;
}

export interface INlStreetQuery {
  cityCode: string;
  street: string;
  /** With a house number the suggestions are addresses, without one street names. */
  houseNumber?: number;
}

export interface INlStreetSuggestion {
  street: string;
  /** Absent for a street name suggested before the house number is typed. */
  houseNumber?: number;
  /** Distinct non-empty postcodes of the BAG addresses behind this row. */
  postcodes: string[];
}

/** Solr envelope every Locatieserver endpoint answers with. */
export interface IPdokResponse<Doc> {
  response?: { numFound: number; docs: Doc[] };
  spellcheck?: { collations?: unknown[] };
}

export interface IPdokCity {
  woonplaatsnaam: string;
  woonplaatscode: string;
  gemeentenaam: string;
  provincienaam: string;
}

export interface IPdokStreet {
  straatnaam: string;
  huisnummer?: number;
  postcode?: string;
}
