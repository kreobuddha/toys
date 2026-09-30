import './CartNotice.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { CURRENCY } from '@/constants/productAttributes';
import type { ICartItem } from '@/features/cart/cartSlice';
import { formatPrice, useLocale } from '@/i18n';
import type { CartProblemKind, ICartItemPreview } from '@/types/order';
import Button from '@components/Button/Button';

interface CartNoticeProps {
  previews: ICartItemPreview[];
  /** The cart as the browser stores it: the prices and titles the customer last saw. */
  items: ICartItem[];
  onApply: () => void;
}

// Explicit map so the keys stay type-checked; an unknown code is skipped rather than shown raw.
const PROBLEM_LABELS = {
  CART_PROBLEM_KIND_PRODUCT_GONE: 'checkout.cartProblemGone',
  CART_PROBLEM_KIND_OUT_OF_STOCK: 'checkout.cartProblemOutOfStock',
  CART_PROBLEM_KIND_QUANTITY_REDUCED: 'checkout.cartProblemQuantity',
  CART_PROBLEM_KIND_PRICE_CHANGED: 'checkout.cartProblemPrice',
} as const;

type KnownProblem = keyof typeof PROBLEM_LABELS;

const isKnownProblem = (code: CartProblemKind): code is KnownProblem => code in PROBLEM_LABELS;

/** What the catalog changed since the cart was filled, one line per product. */
const CartNotice = ({ previews, items, onApply }: CartNoticeProps): ReactElement | null => {
  const { t } = useTranslation('orderSection');
  const locale = useLocale();

  const changed = previews.filter((preview) => (preview.problemCodes ?? []).length > 0);
  if (changed.length === 0) return null;

  const describe = (preview: ICartItemPreview): string[] => {
    const stored = items.find((item) => item.productId === preview.productId);
    const price = (value?: number): string => formatPrice(value ?? 0, CURRENCY, locale);
    return (preview.problemCodes ?? []).filter(isKnownProblem).map((code) =>
      t(PROBLEM_LABELS[code], {
        quantity: preview.current?.purchasableQuantity ?? 0,
        requested: preview.requestedQuantity ?? stored?.quantity ?? 0,
        price: price(preview.current?.unitPriceEuroCents),
        previousPrice: price(stored?.price),
      })
    );
  };

  return (
    <div className="cart-notice" role="status">
      <p className="cart-notice__title">{t('checkout.cartChanged')}</p>
      <ul className="cart-notice__list">
        {changed.map((preview) => {
          const stored = items.find((item) => item.productId === preview.productId);
          return (
            <li key={preview.productId} className="cart-notice__item">
              <span className="cart-notice__product">
                {preview.current?.title ?? stored?.title}
              </span>
              <span className="cart-notice__reasons">{describe(preview).join(' ')}</span>
            </li>
          );
        })}
      </ul>
      <Button variant="secondary" size="sm" onClick={onApply}>
        {t('checkout.cartUpdate')}
      </Button>
    </div>
  );
};

export default CartNotice;
