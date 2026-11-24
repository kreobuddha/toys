// The order the customer just paid for, kept across the trip to the payment page so the result
// page can name the email it was sent to. Session storage: it never outlives the tab.

const STORAGE_KEY = 'toys.lastOrder';

export interface ILastOrder {
  orderId: string;
  email: string;
}

export const saveLastOrder = (order: ILastOrder): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Storage blocked: the result page does without the email.
  }
};

/** The saved order when it is the one the URL names. */
export const loadLastOrder = (orderId: string): ILastOrder | undefined => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const order = raw ? (JSON.parse(raw) as ILastOrder) : undefined;
    return order?.orderId === orderId ? order : undefined;
  } catch {
    return undefined;
  }
};
