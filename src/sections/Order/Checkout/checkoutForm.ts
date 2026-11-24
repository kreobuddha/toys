import type { IAddress } from '@/types/address';
import { normalizePostcode } from '@/utils/nlAddress';
import type { DeliveryType } from './deliveryOptions';

export interface CheckoutFormValues {
  name: string;
  email: string;
  phone: string;
  /** Empty until the customer picks a method. */
  delivery: DeliveryType | '';
  postcode: string;
  /** The number with an optional letter or addition: "12", "12A", "12-2". */
  houseNumber: string;
  street: string;
  city: string;
  /** Postcode typed into the pickup point search. */
  pickupPostcode: string;
  /** Location code of the chosen PostNL pickup point. */
  pickupPoint: string;
}

export const CHECKOUT_DEFAULTS: CheckoutFormValues = {
  name: '',
  email: '',
  phone: '',
  delivery: '',
  postcode: '',
  houseNumber: '',
  street: '',
  city: '',
  pickupPostcode: '',
  pickupPoint: '',
};

// A number from 1 to 99999, then an optional letter or addition after a space or a dash.
const HOUSE_NUMBER_PATTERN = /^([1-9]\d{0,4})(?:\s*[-\s/]?\s*([\p{L}\d]{1,6}))?$/u;

/** "12-2" → { number: "12", addition: "2" }; undefined when it is not a house number. */
export const parseHouseNumber = (
  value: string
): { number: string; addition?: string } | undefined => {
  const match = HOUSE_NUMBER_PATTERN.exec(value.trim());
  if (!match) return undefined;
  const [, number, addition] = match;
  return addition ? { number, addition: addition.toUpperCase() } : { number };
};

/** The address as the contract carries it; the field rules have checked the formats already. */
export const toCheckoutAddress = (values: CheckoutFormValues): IAddress | undefined => {
  const house = parseHouseNumber(values.houseNumber);
  if (!house) return undefined;
  return {
    postalCode: normalizePostcode(values.postcode),
    houseNumber: house.number,
    houseNumberAddition: house.addition,
    street: values.street.trim(),
    city: values.city.trim(),
  };
};
