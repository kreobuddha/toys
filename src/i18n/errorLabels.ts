import { useTranslation } from 'react-i18next';

// The backend names failures with stable codes; the text the customer reads is ours. Explicit
// maps so the keys stay type-checked against the translation file.

const VALIDATION_LABELS = {
  REQUIRED: 'validation.required',
  MUST_BE_POSITIVE: 'validation.mustBePositive',
  OUT_OF_RANGE: 'validation.outOfRange',
  INVALID: 'validation.invalid',
  DUPLICATE: 'validation.duplicate',
} as const;

const REASON_LABELS = {
  PRODUCT_NOT_FOUND: 'errors.productNotFound',
  ARTICLE_NOT_FOUND: 'errors.articleNotFound',
  ORDER_NOT_FOUND: 'errors.orderNotFound',
  CART_TOTAL_TOO_LARGE: 'errors.cartTotalTooLarge',
} as const;

export type ValidationReason = keyof typeof VALIDATION_LABELS;
export type ErrorReason = keyof typeof REASON_LABELS;

const isValidationReason = (reason: string): reason is ValidationReason =>
  reason in VALIDATION_LABELS;

const isErrorReason = (reason: string): reason is ErrorReason => reason in REASON_LABELS;

/** Message for a rejected field; an unknown code falls back to a general one. */
export const useValidationMessage = (): ((reason: string) => string) => {
  const { t } = useTranslation();
  return (reason: string): string =>
    t(isValidationReason(reason) ? VALIDATION_LABELS[reason] : 'validation.invalid');
};

/** Message for a domain failure; an unknown or absent reason falls back to a general one. */
export const useErrorMessage = (): ((reason?: string) => string) => {
  const { t } = useTranslation();
  return (reason?: string): string =>
    t(reason && isErrorReason(reason) ? REASON_LABELS[reason] : 'errors.unknown');
};
