import { useEffect, type ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import { clearCart } from '@/features/cart/cartSlice';
import PaymentResult from '@components/PaymentResult/PaymentResult';
import { loadLastOrder } from '@sections/Order/lastOrder';

/**
 * Where the payment provider sends the customer after a successful payment. The cart lives only
 * in the browser, so arriving here is what empties it; opening the page by hand empties it too,
 * which the team accepted.
 */
const Success = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const links = useLinks();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  // The provider may name the order; otherwise the one saved before leaving for payment.
  const lastOrder = loadLastOrder(searchParams.get('order') ?? undefined);
  const orderId = searchParams.get('order') ?? lastOrder?.orderId;
  const email = lastOrder?.email;

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const text = !orderId
    ? t('success.paidTextNoOrder')
    : email
      ? t('success.paidText', { order: orderId, email })
      : t('success.paidTextNoEmail', { order: orderId });

  return (
    <PaymentResult
      variant="paid"
      title={t('success.paidTitle')}
      text={text}
      action={{ to: links.shop, label: t('success.continue') }}
    />
  );
};

export default Success;
