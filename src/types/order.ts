// Order types, as the backend expects and sends them (toys.v1.OrderService).

import type { IAddress } from './address';

export type DeliveryOptionType =
  | 'DELIVERY_OPTION_TYPE_UNSPECIFIED'
  | 'DELIVERY_OPTION_TYPE_CUSTOMER_PICKUP'
  | 'DELIVERY_OPTION_TYPE_LOCAL_DELIVERY'
  | 'DELIVERY_OPTION_TYPE_POSTNL_HOME'
  | 'DELIVERY_OPTION_TYPE_POSTNL_PICKUP_POINT';

export type PaymentStatus =
  | 'PAYMENT_STATUS_UNSPECIFIED'
  | 'PAYMENT_STATUS_PENDING'
  | 'PAYMENT_STATUS_PAID'
  | 'PAYMENT_STATUS_FAILED'
  | 'PAYMENT_STATUS_EXPIRED';

export interface IOrderItem {
  productId: number;
  quantity: number;
}

/** Exactly one member is set, mirroring the protobuf oneof. */
export interface IOrderDelivery {
  customerPickup?: Record<string, never>;
  localDelivery?: { address: IAddress };
  postnlHomeDelivery?: { address: IAddress };
  postnlPickupPointDelivery?: { locationCode: string };
}

export interface ICreateOrderRequest {
  items: IOrderItem[];
  name: string;
  email: string;
  phone?: string;
  delivery: IOrderDelivery;
}

export interface ICreateOrderResponse {
  orderId: string;
  /** Hosted payment checkout the browser is sent to. */
  checkoutUrl: string;
}

export interface IGetPaymentStatusResponse {
  status: PaymentStatus;
}

export interface IDeliveryOptionsRequest {
  address: IAddress;
}

export interface IDeliveryOption {
  type: DeliveryOptionType;
  /** Euro cents; CreateOrder recalculates it. */
  priceEuroCents?: number;
}

export interface IDeliveryOptionsResponse {
  options?: IDeliveryOption[];
}

export interface IPickupPointsRequest {
  searchAddress: IAddress;
}

export interface IPickupPoint {
  locationCode: string;
  name: string;
  address: IAddress;
  distanceMeters?: number;
}

export interface IPickupPointsResponse {
  pickupPoints?: IPickupPoint[];
}
