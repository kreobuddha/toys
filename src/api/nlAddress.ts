import type { INlAddress } from './types';

// Four digits without a leading zero, then two letters; SA, SD and SS are never issued.
const POSTCODE_PATTERN = /^[1-9][0-9]{3}(?!SA|SD|SS)[A-Z]{2}$/;
const HOUSE_NUMBER_PATTERN = /^[1-9][0-9]{0,4}$/;

export interface INlAddressQuery {
  postcode: string; // normalised, "1012JS"
  houseNumber: number;
}

export interface INlAddressOption {
  address: INlAddress;
  /** Street and house number as BAG writes them: "Herengracht 611-1A". */
  line: string;
}

export interface INlAddressLookup {
  /** Addresses at the postcode and house number, one per letter or addition. */
  options: INlAddressOption[];
  /** The register holds more than came back; PDOK returns at most 100 rows. */
  truncated: boolean;
}

export type NlAddressMatch =
  | { status: 'found'; option: INlAddressOption }
  | { status: 'needsAddition'; additions: string[] }
  | { status: 'notFound' };

/** "1012 js" → "1012JS". Validate with isNlPostcode afterwards. */
export const normalizePostcode = (value: string): string => value.replace(/\s+/g, '').toUpperCase();

export const isNlPostcode = (value: string): boolean =>
  POSTCODE_PATTERN.test(normalizePostcode(value));

/** "1012JS" → "1012 JS", as written on an envelope. */
export const formatPostcode = (value: string): string => {
  const postcode = normalizePostcode(value);
  return `${postcode.slice(0, 4)} ${postcode.slice(4)}`;
};

/** A typed addition ("-1a", "a 2") in comparable form: letters and digits only, upper case. */
export const normalizeAddition = (value: string): string =>
  value.replace(/[^0-9a-z]/gi, '').toUpperCase();

export const parseHouseNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  return HOUSE_NUMBER_PATTERN.test(trimmed) ? Number(trimmed) : undefined;
};

/** Lookup arguments, once the postcode and house number are both complete and valid. */
export const toNlAddressQuery = (
  postcode: string,
  houseNumber: string
): INlAddressQuery | undefined => {
  const normalized = normalizePostcode(postcode);
  const number = parseHouseNumber(houseNumber);
  return isNlPostcode(normalized) && number !== undefined
    ? { postcode: normalized, houseNumber: number }
    : undefined;
};

/** The address for a typed addition among those found at a postcode and house number. */
export const matchNlAddress = (lookup: INlAddressLookup, addition: string): NlAddressMatch => {
  const { options, truncated } = lookup;
  if (options.length === 0) return { status: 'notFound' };
  const wanted = normalizeAddition(addition);
  const option = options.find((item) => normalizeAddition(item.address.addition ?? '') === wanted);
  if (option) return { status: 'found', option };
  // Postcode and house number already fix street and city; a cut-off list may just miss the
  // addition, so it is taken as typed.
  if (truncated && wanted) {
    const { address } = options[0];
    return {
      status: 'found',
      option: {
        address: { ...address, addition: wanted },
        line: `${address.street} ${address.houseNumber}-${wanted}`,
      },
    };
  }
  return {
    status: 'needsAddition',
    additions: options.flatMap((item) => item.address.addition ?? []),
  };
};
