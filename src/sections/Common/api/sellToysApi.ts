import { api } from '@/api/api';
import type { ISubmitOfferRequest } from '@/types/sellToys';

export const sellToysApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** An empty response means the offer was accepted. */
    submitOffer: build.mutation<Record<string, never>, ISubmitOfferRequest>({
      query: (data) => ({ url: '/sell-toys/offers', method: 'post', data }),
    }),
  }),
});

export const { useSubmitOfferMutation } = sellToysApi;
