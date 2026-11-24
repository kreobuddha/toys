import './Success.scss';
import { useEffect, useState, type ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useAppDispatch } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import { clearCart } from '@/features/cart/cartSlice';
import ButtonLink from '@components/ButtonLink/ButtonLink';
import { useGetOrderPaymentStatusQuery } from '@sections/Order/api/ordersApi';
import { loadLastOrder } from '@sections/Order/lastOrder';

const POLL_INTERVAL_MS = 2000;

/**
 * Where the payment page sends the customer back. The backend learns the outcome from the
 * payment provider, so the page asks it until the payment stops pending. Only a paid order
 * empties the cart: after a failed one the customer goes back to try again.
 */
const Success = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const links = useLinks();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order') ?? '';

  // Polling stops once the payment settles; set during render, the way a derived state is.
  const [settled, setSettled] = useState(false);
  const { data, isError } = useGetOrderPaymentStatusQuery(orderId || skipToken, {
    pollingInterval: settled ? 0 : POLL_INTERVAL_MS,
    skipPollingIfUnfocused: true,
  });
  const status = data?.status;
  const paid = status === 'PAYMENT_STATUS_PAID';
  const failed =
    !orderId ||
    isError ||
    status === 'PAYMENT_STATUS_FAILED' ||
    status === 'PAYMENT_STATUS_EXPIRED';

  if ((paid || failed) && !settled) setSettled(true);

  useEffect(() => {
    if (paid) dispatch(clearCart());
  }, [paid, dispatch]);

  const renderResult = (): ReactElement => {
    if (paid) {
      const email = loadLastOrder(orderId)?.email;
      return (
        <>
          <img src="/icons/payment-ok.svg" alt="" className="success__icon" />
          <h1 className="success__title">{t('success.paidTitle')}</h1>
          <p className="success__text">
            {email
              ? t('success.paidText', { order: orderId, email })
              : t('success.paidTextNoEmail', { order: orderId })}
          </p>
          <ButtonLink to={links.shop}>{t('success.continue')}</ButtonLink>
        </>
      );
    }
    if (failed) {
      return (
        <>
          <img src="/icons/payment-failed.svg" alt="" className="success__icon" />
          <h1 className="success__title">{t('success.failedTitle')}</h1>
          <p className="success__text">{t('success.failedText')}</p>
          <ButtonLink to={links.checkout}>{t('success.backToCart')}</ButtonLink>
        </>
      );
    }
    return (
      <>
        <span className="success__spinner" aria-hidden />
        <h1 className="success__title">{t('success.checkingTitle')}</h1>
        <p className="success__text">{t('success.checkingText')}</p>
      </>
    );
  };

  return (
    <section className="container success">
      <div className="success__card" aria-live="polite">
        {renderResult()}
      </div>
    </section>
  );
};

export default Success;
