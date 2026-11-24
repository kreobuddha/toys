import { api } from '@/api/api';
import type {
  IGetSellToysDeliveryOptionsResponse,
  ISubmitOfferRequest,
  ISubmitOfferResponse,
} from '@/types/sellToys';

export const sellToysApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** Ways the seller can hand the toys over, with the shop's own pickup points. */
    getSellToysDeliveryOptions: build.query<IGetSellToysDeliveryOptionsResponse, void>({
      query: () => ({ url: '/sell-toys/delivery-options', method: 'get' }),
    }),
    submitOffer: build.mutation<ISubmitOfferResponse, ISubmitOfferRequest>({
      query: (data) => ({ url: '/sell-toys/offers', method: 'post', data }),
    }),
  }),
});

export const { useGetSellToysDeliveryOptionsQuery, useSubmitOfferMutation } = sellToysApi;
