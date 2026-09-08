import './Success.scss';
import { useEffect, type ReactElement } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import { clearCart } from '@/features/cart/cartSlice';

/** Landing page after Stripe redirects back; the cart is emptied here. */
const Success = (): ReactElement => {
  const { t } = useTranslation();
  const links = useLinks();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <section className="container success">
      <h1 className="success__title">{t('success.title')}</h1>
      <p className="success__text">{t('success.text')}</p>
      {orderId && (
        <p className="success__order">
          {t('success.order')}: <strong>{orderId}</strong>
        </p>
      )}
      <Link to={links.home}>{t('success.backHome')}</Link>
    </section>
  );
};

export default Success;
