import './Checkout.scss';
import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { DeliveryMethod, ICreateOrderInput } from '@/api/types';
import { useCreateOrderMutation } from '@/api/api';
import { useAppSelector } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import { selectCartItems, selectCartTotal } from '@/features/cart/cartSlice';
import { formatPrice, useLocale } from '@/i18n';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import OrderSummary from './components/OrderSummary/OrderSummary';
import { DELIVERY_OPTIONS } from './deliveryOptions';

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  delivery: DeliveryMethod;
  address: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Explicit map so the keys stay type-checked against the translation file.
const DELIVERY_LABELS = {
  pickup: { name: 'checkout.deliveryPickup', hint: 'checkout.deliveryPickupHint' },
  courier: { name: 'checkout.deliveryCourier', hint: 'checkout.deliveryCourierHint' },
  post: { name: 'checkout.deliveryPost', hint: 'checkout.deliveryPostHint' },
} as const satisfies Record<DeliveryMethod, { name: string; hint: string }>;

const Checkout = (): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const links = useLinks();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const currency = items[0]?.currency ?? 'EUR';
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [submitError, setSubmitError] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: { name: '', email: '', phone: '', delivery: 'pickup', address: '' },
  });

  const deliveryMethod = useWatch({ control, name: 'delivery' });
  const delivery = DELIVERY_OPTIONS.find((o) => o.method === deliveryMethod) ?? DELIVERY_OPTIONS[0];

  const onSubmit = async (form: CheckoutForm): Promise<void> => {
    setSubmitError(false);
    const input: ICreateOrderInput = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      contact: { name: form.name, email: form.email, phone: form.phone || undefined },
      delivery: {
        method: form.delivery,
        address: delivery.needsAddress ? form.address : undefined,
      },
    };
    try {
      const { checkoutUrl } = await createOrder(input).unwrap();
      // Stripe Checkout is hosted off-site, so a full navigation is intended.
      window.location.assign(checkoutUrl);
    } catch {
      setSubmitError(true);
    }
  };

  if (items.length === 0) {
    return (
      <section className="container checkout">
        <h1 className="checkout__title">{t('checkout.title')}</h1>
        <p className="checkout__empty">{t('checkout.empty')}</p>
        <Link to={links.catalog}>{t('checkout.goToCatalog')}</Link>
      </section>
    );
  }

  return (
    <section className="container checkout">
      <h1 className="checkout__title">{t('checkout.title')}</h1>
      <div className="checkout__layout">
        <form className="checkout__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <fieldset className="checkout__fieldset">
            <legend className="checkout__legend">{t('checkout.contact')}</legend>
            <div className="checkout__field">
              <Input
                id="name"
                label={t('checkout.name')}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                {...register('name', { required: t('checkout.required') })}
              />
              {errors.name && <span className="checkout__error">{errors.name.message}</span>}
            </div>
            <div className="checkout__field">
              <Input
                id="email"
                type="email"
                label={t('checkout.email')}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register('email', {
                  required: t('checkout.required'),
                  pattern: { value: EMAIL_PATTERN, message: t('checkout.invalidEmail') },
                })}
              />
              {errors.email && <span className="checkout__error">{errors.email.message}</span>}
            </div>
            <div className="checkout__field">
              <Input
                id="phone"
                type="tel"
                label={t('checkout.phone')}
                autoComplete="tel"
                {...register('phone')}
              />
            </div>
          </fieldset>

          <fieldset className="checkout__fieldset">
            <legend className="checkout__legend">{t('checkout.delivery')}</legend>
            <div className="checkout__options">
              {DELIVERY_OPTIONS.map((option) => (
                <label
                  key={option.method}
                  className={clsx(
                    'checkout__option',
                    delivery.method === option.method && 'checkout__option--selected'
                  )}
                >
                  <input
                    type="radio"
                    value={option.method}
                    className="checkout__radio"
                    {...register('delivery')}
                  />
                  <span className="checkout__option-body">
                    <span className="checkout__option-name">
                      {t(DELIVERY_LABELS[option.method].name)}
                    </span>
                    <span className="checkout__option-hint">
                      {t(DELIVERY_LABELS[option.method].hint)}
                    </span>
                  </span>
                  <span className="checkout__option-price">
                    {option.price === 0
                      ? t('checkout.free')
                      : formatPrice(option.price, currency, locale)}
                  </span>
                </label>
              ))}
            </div>
            {delivery.needsAddress && (
              <div className="checkout__field">
                <Input
                  id="address"
                  label={t('checkout.address')}
                  autoComplete="street-address"
                  aria-invalid={Boolean(errors.address)}
                  {...register('address', { required: t('checkout.required') })}
                />
                {errors.address && (
                  <span className="checkout__error">{errors.address.message}</span>
                )}
              </div>
            )}
          </fieldset>

          {submitError && <p className="checkout__error">{t('checkout.submitError')}</p>}

          <Button type="submit" disabled={isLoading} className="checkout__submit">
            {isLoading ? t('checkout.paying') : t('checkout.pay')}
          </Button>
        </form>

        <OrderSummary
          items={items}
          subtotal={subtotal}
          deliveryCost={delivery.price}
          currency={currency}
        />
      </div>
    </section>
  );
};

export default Checkout;
