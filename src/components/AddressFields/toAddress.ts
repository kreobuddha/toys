import type { IAddress } from '@/types/address';
import { normalizePostcode, resolveStreet } from '@/utils/nlAddress';
import type { AddressFormValues } from './AddressFields';

/**
 * The address as the contract carries it. The field rules have already checked the formats;
 * anything typed after the house number ("Dam 5B") joins the addition.
 */
export const toAddress = (values: AddressFormValues): IAddress | undefined => {
  const parts = resolveStreet(values.addressLine, values.addressPick);
  if (!parts) return undefined;
  const addition = [parts.rest, values.apartment.trim()].filter(Boolean).join(' ');
  return {
    postalCode: normalizePostcode(values.postcode),
    city: values.city.trim(),
    street: parts.street,
    houseNumber: String(parts.houseNumber),
    houseNumberAddition: addition || undefined,
  };
};
