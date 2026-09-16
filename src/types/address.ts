// Address as the backend expects it (toys.v1.Address). The shop delivers within the Netherlands
// only, so the contract carries no country.

export interface IAddress {
  /** Dutch postcode, four digits and two letters. */
  postalCode: string;
  /** Digits only; a letter, addition or floor belongs in houseNumberAddition. */
  houseNumber: string;
  houseNumberAddition?: string;
  street: string;
  city: string;
}
