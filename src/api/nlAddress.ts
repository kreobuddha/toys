// Dutch address helpers shared by the checkout form and the mocks. No React here.

// Four digits without a leading zero, then two letters; SA, SD and SS are never issued.
const POSTCODE_PATTERN = /^[1-9][0-9]{3}(?!SA|SD|SS)[A-Z]{2}$/;

// A street with at least one letter, a house number from 1 to 99999, then an optional letter,
// addition or floor. A street with a number in its name ("Plein 1944 12") splits wrongly; picking
// the suggestion avoids that.
const ADDRESS_LINE_PATTERN =
  /^([^,]*?\p{L}[^,]*?)\s+([1-9]\d{0,4})(?!\d)(?:[\s/-]*([\p{L}\d][^,]{0,19}))?$/iu;

/** A locality (woonplaats) in the BAG. Its code is the only exact filter for its addresses. */
export interface INlCity {
  name: string;
  code: string;
}

export interface IAddressLineParts {
  street: string;
  houseNumber: number;
  /** What follows the house number: "B", "1A", "2 hoog". */
  rest?: string;
}

/** A picked "street + house number" suggestion. */
export interface IAddressPick {
  label: string;
  street: string;
  houseNumber: number;
}

/** "1012 js" → "1012JS". Validate with isNlPostcode afterwards. */
export const normalizePostcode = (value: string): string => value.replace(/\s+/g, '').toUpperCase();

export const isNlPostcode = (value: string): boolean =>
  POSTCODE_PATTERN.test(normalizePostcode(value));

/** "1012JS" → "1012 JS", as written on an envelope. */
export const formatPostcode = (value: string): string => {
  const postcode = normalizePostcode(value);
  return `${postcode.slice(0, 4)} ${postcode.slice(4)}`;
};

/** "Herengracht 611-1A" → { street: "Herengracht", houseNumber: 611, rest: "1A" }. */
export const parseAddressLine = (line: string): IAddressLineParts | undefined => {
  const match = ADDRESS_LINE_PATTERN.exec(line.trim().replace(/\s+/g, ' '));
  if (!match) return undefined;
  const [, street, houseNumber, rest] = match;
  const parts = { street, houseNumber: Number(houseNumber) };
  return rest ? { ...parts, rest } : parts;
};

/**
 * Street and house number of an address line: taken from the picked suggestion while the line
 * still shows it (so streets with a number in their name survive), parsed otherwise.
 */
export const resolveStreet = (
  line: string,
  pick: IAddressPick | null
): IAddressLineParts | undefined =>
  pick && line.trim() === pick.label
    ? { street: pick.street, houseNumber: pick.houseNumber }
    : parseAddressLine(line);
