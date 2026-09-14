import { useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { formatPostcode, matchNlAddress, toNlAddressQuery } from '@/api/nlAddress';
import { useLookupNlAddressQuery } from '@/api/pdokApi';
import type { INlAddress } from '@/api/types';

export type AddressLookupStatus =
  'idle' | 'loading' | 'found' | 'needsAddition' | 'notFound' | 'unavailable';

export interface AddressLookup {
  status: AddressLookupStatus;
  address?: INlAddress;
  /** Confirmation for the visitor: "Dam 1, 1012 JS Amsterdam". */
  summary?: string;
  /** Letters and additions that exist at the postcode and house number. */
  additions: string[];
}

const LOOKUP_DELAY_MS = 400;

/**
 * Looks up a Dutch postcode and house number in the BAG once typing pauses. The addition is
 * matched against the result locally, without another request.
 */
export const useAddressLookup = (
  postcode: string,
  houseNumber: string,
  addition: string
): AddressLookup => {
  const query = toNlAddressQuery(postcode, houseNumber);
  const key = query ? `${query.postcode} ${query.houseNumber}` : '';
  const [settledKey, setSettledKey] = useState(key);

  useEffect(() => {
    const timer = setTimeout(() => setSettledKey(key), LOOKUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [key]);

  const settled = query !== undefined && settledKey === key;
  const { data, isFetching, isError } = useLookupNlAddressQuery(settled ? query : skipToken);

  if (!query) return { status: 'idle', additions: [] };
  if (!settled || isFetching) return { status: 'loading', additions: [] };
  if (isError || !data) return { status: 'unavailable', additions: [] };

  const additions = data.options.flatMap((option) => option.address.addition ?? []);
  const match = matchNlAddress(data, addition);
  if (match.status !== 'found') return { status: match.status, additions };

  const { address, line } = match.option;
  return {
    status: 'found',
    address,
    summary: `${line}, ${formatPostcode(address.postcode)} ${address.city}`,
    additions,
  };
};
