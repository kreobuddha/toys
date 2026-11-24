import { api } from '@/api/api';
import type {
  ICreateOrderRequest,
  ICreateOrderResponse,
  IDeliveryOptionsRequest,
  IDeliveryOptionsResponse,
  IGetPaymentStatusResponse,
  IPickupPointsRequest,
  IPickupPointsResponse,
  IPreviewCartRequest,
  IPreviewCartResponse,
} from '@/types/order';

export const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** Current prices and availability; it reserves nothing, CreateOrder checks again. */
    /** Methods that can serve the address, with their prices; CreateOrder prices again. */
    getDeliveryOptions: build.query<IDeliveryOptionsResponse, IDeliveryOptionsRequest>({
      query: (data) => ({ url: '/delivery-options', method: 'post', data }),
    }),
    /** PostNL pickup points near a postcode, nearest first. */
    listPickupPoints: build.query<IPickupPointsResponse, IPickupPointsRequest>({
      query: (data) => ({ url: '/postnl/pickup-points', method: 'post', data }),
    }),
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

export const {
  useGetDeliveryOptionsQuery,
  useLazyListPickupPointsQuery,
  usePreviewCartQuery,
  useCreateOrderMutation,
  useGetOrderPaymentStatusQuery,
} = ordersApi;
