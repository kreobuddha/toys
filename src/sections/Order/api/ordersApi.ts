import { api } from '@/api/api';
import type {
  ICreateOrderRequest,
  ICreateOrderResponse,
  IGetPaymentStatusResponse,
} from '@/types/order';

export const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<ICreateOrderResponse, ICreateOrderRequest>({
      query: (data) => ({ url: '/orders', method: 'post', data }),
    }),
    getOrderPaymentStatus: build.query<IGetPaymentStatusResponse, string>({
      query: (orderId) => ({ url: `/orders/${orderId}/payment-status`, method: 'get' }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderPaymentStatusQuery } = ordersApi;
