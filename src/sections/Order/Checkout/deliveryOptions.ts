import type { IAddress } from '@/types/address';
import type { IOrderDelivery } from '@/types/order';

/** Delivery methods the checkout offers. */
export type DeliveryMethod = 'pickup' | 'courier' | 'post';

export interface IDeliveryOption {
  method: DeliveryMethod;
  price: number; // euro cents
  needsAddress: boolean;
}

// Until the checkout asks the backend for delivery options and their prices
// (OrderService.GetAvailableDeliveryOptions), they live here.
export const DELIVERY_OPTIONS: IDeliveryOption[] = [
  { method: 'pickup', price: 0, needsAddress: false },
  { method: 'courier', price: 500, needsAddress: true },
  { method: 'post', price: 700, needsAddress: true },
];

/** The chosen method as the order carries it: the contract uses one member per method. */
export const toOrderDelivery = (method: DeliveryMethod, address?: IAddress): IOrderDelivery => {
  switch (method) {
    case 'courier':
      return address ? { localDelivery: { address } } : {};
    case 'post':
      return address ? { postnlHomeDelivery: { address } } : {};
    case 'pickup':
    default:
      return { customerPickup: {} };
  }
};
