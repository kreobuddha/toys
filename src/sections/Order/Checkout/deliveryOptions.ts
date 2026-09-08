import type { DeliveryMethod } from '@/api/types';

export interface IDeliveryOption {
  method: DeliveryMethod;
  price: number; // minor units
  needsAddress: boolean;
}

// Until the backend exposes delivery methods, they live here.
export const DELIVERY_OPTIONS: IDeliveryOption[] = [
  { method: 'pickup', price: 0, needsAddress: false },
  { method: 'courier', price: 500, needsAddress: true },
  { method: 'post', price: 700, needsAddress: true },
];
