import type { CartProblemKind, ICartItemPreview } from '@/types/order';

export type CartProblem = 'gone' | 'outOfStock' | 'quantity' | 'price';

// The first match wins: a toy that is gone cannot also need a price review.
const BY_PRIORITY: readonly [CartProblemKind, CartProblem][] = [
  ['CART_PROBLEM_KIND_PRODUCT_GONE', 'gone'],
  ['CART_PROBLEM_KIND_OUT_OF_STOCK', 'outOfStock'],
  ['CART_PROBLEM_KIND_QUANTITY_REDUCED', 'quantity'],
  ['CART_PROBLEM_KIND_PRICE_CHANGED', 'price'],
];

/** The one problem to show for an item; unknown codes are ignored. */
export const problemOf = (preview?: ICartItemPreview): CartProblem | undefined => {
  const codes = preview?.problemCodes ?? [];
  return BY_PRIORITY.find(([code]) => codes.includes(code))?.[1];
};
