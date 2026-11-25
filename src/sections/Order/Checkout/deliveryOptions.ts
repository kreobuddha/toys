import type { IAddress } from '@/types/address';
import type { DeliveryOptionType, IDeliveryOption, IOrderDelivery } from '@/types/order';

export type DeliveryType = Exclude<DeliveryOptionType, 'DELIVERY_OPTION_TYPE_UNSPECIFIED'>;

/** The order the checkout lists the methods in, whatever order the backend sends. */
export const DELIVERY_ORDER: readonly DeliveryType[] = [
  'DELIVERY_OPTION_TYPE_LOCAL_DELIVERY',
  'DELIVERY_OPTION_TYPE_POSTNL_PICKUP_POINT',
  'DELIVERY_OPTION_TYPE_POSTNL_HOME',
  'DELIVERY_OPTION_TYPE_CUSTOMER_PICKUP',
];

export interface IDeliveryChoice {
  type: DeliveryType;
  /** Euro cents. */
  price: number;
}

/**
 * The three methods and prices the design shows. Temporary: the checkout lists these instead of
 * asking GetAvailableDeliveryOptions until the backend answers it as the design needs.
 */
export const DESIGN_DELIVERY_CHOICES: readonly IDeliveryChoice[] = [
  { type: 'DELIVERY_OPTION_TYPE_LOCAL_DELIVERY', price: 500 },
  { type: 'DELIVERY_OPTION_TYPE_POSTNL_PICKUP_POINT', price: 700 },
  { type: 'DELIVERY_OPTION_TYPE_POSTNL_HOME', price: 700 },
];

const isKnownType = (type: DeliveryOptionType): type is DeliveryType =>
  DELIVERY_ORDER.includes(type as DeliveryType);

/** Methods delivering to the customer's own address. */
export const needsAddress = (type: DeliveryType | ''): boolean =>
  type === 'DELIVERY_OPTION_TYPE_LOCAL_DELIVERY' || type === 'DELIVERY_OPTION_TYPE_POSTNL_HOME';

/**
 * Methods to list: everything the shop offers, priced for the customer's address once the
 * backend has seen it. `forAddress` wins on price, since it is the more specific answer.
 */
export const toDeliveryChoices = (
  offered: IDeliveryOption[] = [],
  forAddress: IDeliveryOption[] = []
): IDeliveryChoice[] => {
  const prices = new Map<DeliveryType, number>();
  for (const option of [...offered, ...forAddress]) {
    if (isKnownType(option.type)) prices.set(option.type, option.priceEuroCents ?? 0);
  }
  return DELIVERY_ORDER.flatMap((type) => {
    const price = prices.get(type);
    return price === undefined ? [] : [{ type, price }];
  });
};

/** The chosen method as the order carries it: the contract uses one member per method. */
export const toOrderDelivery = (
  type: DeliveryType,
  address?: IAddress,
  locationCode?: string,
  deliveryNotes?: string
): IOrderDelivery => {
  const toDoor = address && { address, deliveryNotes: deliveryNotes?.trim() || undefined };
  switch (type) {
    case 'DELIVERY_OPTION_TYPE_LOCAL_DELIVERY':
      return toDoor ? { localDelivery: toDoor } : {};
    case 'DELIVERY_OPTION_TYPE_POSTNL_HOME':
      return toDoor ? { postnlHomeDelivery: toDoor } : {};
    case 'DELIVERY_OPTION_TYPE_POSTNL_PICKUP_POINT':
      return locationCode ? { postnlPickupPointDelivery: { locationCode } } : {};
    case 'DELIVERY_OPTION_TYPE_CUSTOMER_PICKUP':
    default:
      return { customerPickup: {} };
  }
};
