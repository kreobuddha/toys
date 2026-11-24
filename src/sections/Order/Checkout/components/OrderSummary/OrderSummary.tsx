import './OrderSummary.scss';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useLinks } from '@/app/useLinks';
import { CURRENCY } from '@/constants/productAttributes';
import type { ICartItem } from '@/features/cart/cartSlice';
import { formatPrice, useLocale } from '@/i18n';
import type { ICartItemPreview } from '@/types/order';
import Button from '@components/Button/Button';
import { problemOf } from '@sections/Order/Checkout/cartProblems';

interface OrderSummaryProps {
  items: ICartItem[];
  previews: ICartItemPreview[];
  subtotal: number;
  /** Undefined until a delivery method is chosen. */
  deliveryCost?: number;
  onRemove: (productId: number) => void;
  onSetQuantity: (productId: number, quantity: number) => void;
  onAcceptPrice: (productId: number, price: number) => void;
}

/** The cart as it will be ordered; toys the catalog changed get a card with the fix. */
const OrderSummary = ({
  items,
  previews,
  subtotal,
  deliveryCost,
  onRemove,
  onSetQuantity,
  onAcceptPrice,
}: OrderSummaryProps): ReactElement => {
  const { t } = useTranslation('orderSection');
  const locale = useLocale();
  const links = useLinks();
  const price = (cents: number): string => formatPrice(cents, CURRENCY, locale);
  const previewOf = (id: number): ICartItemPreview | undefined =>
    previews.find((preview) => preview.productId === id);
  const hasProblems = items.some((item) => problemOf(previewOf(item.productId)));

  const renderItem = (item: ICartItem, newPrice?: number): ReactElement => (
    <div className="order-summary__item">
      {item.image ? (
        <img src={item.image} alt="" className="order-summary__thumb" />
      ) : (
        <span className="order-summary__thumb" />
      )}
      <div className="order-summary__info">
        <span className="order-summary__name">{item.title}</span>
        <span className="order-summary__quantity">
          {t('checkout.quantity', { count: item.quantity })}
        </span>
      </div>
      <div className="order-summary__prices">
        <span
          className={clsx(
            'order-summary__price',
            newPrice !== undefined && 'order-summary__price--old'
          )}
        >
          {price(item.price * item.quantity)}
        </span>
        {newPrice !== undefined && (
          <span className="order-summary__new-price">{price(newPrice * item.quantity)}</span>
        )}
      </div>
    </div>
  );

  const renderProblem = (item: ICartItem, preview: ICartItemPreview): ReactElement | null => {
    const problem = problemOf(preview);
    const current = preview.current;
    const available = current?.purchasableQuantity ?? 0;
    const newPrice = current?.unitPriceEuroCents ?? item.price;
    const remove = (
      <Button
        size="sm"
        variant={problem === 'price' ? 'secondary' : 'primary'}
        onClick={() => onRemove(item.productId)}
      >
        {t('checkout.problem.remove')}
      </Button>
    );

    switch (problem) {
      case 'gone':
      case 'outOfStock':
        return (
          <>
            <p className="order-summary__problem-title">
              {problem === 'gone'
                ? t('checkout.problem.goneTitle')
                : t('checkout.problem.outOfStockTitle')}
            </p>
            <p className="order-summary__problem-text">{t('checkout.problem.removeText')}</p>
            <div className="order-summary__actions">{remove}</div>
          </>
        );
      case 'quantity':
        return (
          <>
            <p className="order-summary__problem-title">
              {t('checkout.problem.quantityTitle', { count: available })}
            </p>
            <p className="order-summary__problem-text">
              {t('checkout.problem.quantityText', { count: available, requested: item.quantity })}
            </p>
            <div className="order-summary__actions">
              <Button size="sm" onClick={() => onSetQuantity(item.productId, available)}>
                {t('checkout.problem.updateQuantity', { count: available })}
              </Button>
            </div>
          </>
        );
      case 'price':
        return (
          <>
            <p className="order-summary__problem-title">{t('checkout.problem.priceTitle')}</p>
            <p className="order-summary__problem-text">
              {t('checkout.problem.priceText', { price: price(newPrice) })}
            </p>
            <div className="order-summary__actions">
              {remove}
              <Button size="sm" onClick={() => onAcceptPrice(item.productId, newPrice)}>
                {t('checkout.problem.acceptPrice')}
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="order-summary">
      <h2 className="order-summary__title">{t('checkout.summary')}</h2>
      <ul className="order-summary__list">
        {items.map((item) => {
          const preview = previewOf(item.productId);
          const problem = problemOf(preview);
          return (
            <li
              key={item.productId}
              className={clsx(problem && 'order-summary__problem')}
              aria-invalid={problem ? true : undefined}
            >
              {renderItem(
                item,
                problem === 'price' ? preview?.current?.unitPriceEuroCents : undefined
              )}
              {preview && renderProblem(item, preview)}
            </li>
          );
        })}
      </ul>
      <dl className="order-summary__amounts">
        <div className="order-summary__amount">
          <dt>{hasProblems ? t('checkout.previousSubtotal') : t('checkout.subtotal')}</dt>
          <dd>{price(subtotal)}</dd>
        </div>
        <div className="order-summary__amount">
          <dt>{t('checkout.deliveryCost')}</dt>
          <dd>
            {deliveryCost === undefined
              ? '—'
              : deliveryCost === 0
                ? t('checkout.free')
                : price(deliveryCost)}
          </dd>
        </div>
      </dl>
      <p className="order-summary__total">
        <span className="order-summary__total-label">
          {hasProblems ? t('checkout.previousTotal') : t('checkout.total')}
        </span>
        <span className="order-summary__total-value">{price(subtotal + (deliveryCost ?? 0))}</span>
      </p>
      <p className="order-summary__note">{t('checkout.vatNote')}</p>
      {hasProblems && (
        <Link to={links.shop} className="order-summary__back">
          {t('checkout.backToShop')}
        </Link>
      )}
    </aside>
  );
};

export default OrderSummary;
