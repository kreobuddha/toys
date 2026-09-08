import './OrderSummary.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { ICartItem } from '@/features/cart/cartSlice';
import { formatPrice, useLocale } from '@/i18n';

interface OrderSummaryProps {
  items: ICartItem[];
  subtotal: number;
  deliveryCost: number;
  currency: string;
}

const OrderSummary = ({
  items,
  subtotal,
  deliveryCost,
  currency,
}: OrderSummaryProps): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const price = (minor: number): string => formatPrice(minor, currency, locale);

  return (
    <aside className="order-summary">
      <h2 className="order-summary__title">{t('checkout.summary')}</h2>
      <ul className="order-summary__list">
        {items.map((item) => (
          <li key={item.productId} className="order-summary__item">
            {item.image && <img src={item.image} alt="" className="order-summary__thumb" />}
            <span className="order-summary__name">
              {item.title}
              {item.quantity > 1 && <span className="order-summary__qty"> × {item.quantity}</span>}
            </span>
            <span className="order-summary__price">{price(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="order-summary__totals">
        <dt>{t('checkout.subtotal')}</dt>
        <dd>{price(subtotal)}</dd>
        <dt>{t('checkout.deliveryCost')}</dt>
        <dd>{deliveryCost === 0 ? t('checkout.free') : price(deliveryCost)}</dd>
        <dt className="order-summary__total">{t('checkout.total')}</dt>
        <dd className="order-summary__total">{price(subtotal + deliveryCost)}</dd>
      </dl>
    </aside>
  );
};

export default OrderSummary;
