import { api } from '@/api/api';
import type { ISubscribeToLaunchRequest, ISubscribeToLaunchResponse } from '@/types/launch';

export const launchApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** Remembers an email to notify when the shop opens; a repeat is not an error. */
    subscribeToLaunch: build.mutation<ISubscribeToLaunchResponse, ISubscribeToLaunchRequest>({
      query: (data) => ({ url: '/launch-subscriptions', method: 'post', data }),
    }),
  }),
});

export const { useSubscribeToLaunchMutation } = launchApi;
