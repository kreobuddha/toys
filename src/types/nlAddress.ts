// Dutch address shapes used by the checkout form. The backend contract's own address lives in
// `address.ts`.

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
