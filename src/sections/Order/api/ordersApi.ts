import { api } from '@/api/api';
import type {
  ICreateOrderRequest,
  ICreateOrderResponse,
  IGetPaymentStatusResponse,
  IPreviewCartRequest,
  IPreviewCartResponse,
} from '@/types/order';

export const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** Current prices and availability; it reserves nothing, CreateOrder checks again. */
    previewCart: build.query<IPreviewCartResponse, IPreviewCartRequest>({
      query: (data) => ({ url: '/cart/preview', method: 'post', data }),
    }),
    createOrder: build.mutation<ICreateOrderResponse, ICreateOrderRequest>({
      query: (data) => ({ url: '/orders', method: 'post', data }),
    }),
    getOrderPaymentStatus: build.query<IGetPaymentStatusResponse, string>({
      query: (orderId) => ({ url: `/orders/${orderId}/payment-status`, method: 'get' }),
    }),
  }),
});

export const { usePreviewCartQuery, useCreateOrderMutation, useGetOrderPaymentStatusQuery } =
  ordersApi;
