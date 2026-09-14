import './Checkout.scss';
import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { DeliveryMethod, ICreateOrderInput, INlAddress } from '@/api/types';
import { useCreateOrderMutation } from '@/api/api';
import { normalizePostcode, parseAddressLine } from '@/api/nlAddress';
import { useAppSelector } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import { selectCartItems, selectCartTotal } from '@/features/cart/cartSlice';
import { formatPrice, useLocale } from '@/i18n';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import AddressFields, { type AddressFormValues } from './components/AddressFields/AddressFields';
import OrderSummary from './components/OrderSummary/OrderSummary';
import { DELIVERY_OPTIONS } from './deliveryOptions';

interface CheckoutForm extends AddressFormValues {
  name: string;
  email: string;
  phone: string;
  delivery: DeliveryMethod;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Explicit map so the keys stay type-checked against the translation file.
const DELIVERY_LABELS = {
  pickup: { name: 'checkout.deliveryPickup', hint: 'checkout.deliveryPickupHint' },
  courier: { name: 'checkout.deliveryCourier', hint: 'checkout.deliveryCourierHint' },
  post: { name: 'checkout.deliveryPost', hint: 'checkout.deliveryPostHint' },
} as const satisfies Record<DeliveryMethod, { name: string; hint: string }>;

/**
 * The delivery address as the order carries it. The field rules have already checked the
 * formats; anything typed after the house number ("Dam 5B") joins the apartment.
 */
const toNlAddress = (values: AddressFormValues): INlAddress | undefined => {
  const parts = parseAddressLine(values.addressLine);
  if (!parts) return undefined;
  const apartment = [parts.rest, values.apartment.trim()].filter(Boolean).join(' ');
  return {
    postcode: normalizePostcode(values.postcode),
    city: values.city.trim(),
    street: parts.street,
    houseNumber: parts.houseNumber,
    apartment: apartment || undefined,
    country: 'NL',
  };
};

const Checkout = (): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const links = useLinks();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const currency = items[0]?.currency ?? 'EUR';
  const [createOrder] = useCreateOrderMutation();
  const [submitError, setSubmitError] = useState(false);

  const form = useForm<CheckoutForm>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      delivery: 'pickup',
      city: '',
      addressLine: '',
      apartment: '',
      postcode: '',
    },
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const deliveryMethod = useWatch({ control, name: 'delivery' });
  const delivery = DELIVERY_OPTIONS.find((o) => o.method === deliveryMethod) ?? DELIVERY_OPTIONS[0];

  const onSubmit = async (values: CheckoutForm): Promise<void> => {
    setSubmitError(false);
    const address = delivery.needsAddress ? toNlAddress(values) : undefined;
    if (delivery.needsAddress && !address) return;
    const input: ICreateOrderInput = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      contact: { name: values.name, email: values.email, phone: values.phone || undefined },
      delivery: { method: values.delivery, address },
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
        <Link to={links.shop}>{t('checkout.goToShop')}</Link>
      </section>
    );
  }

  return (
    <section className="container checkout">
      <h1 className="checkout__title">{t('checkout.title')}</h1>
      <div className="checkout__layout">
        <FormProvider {...form}>
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
              {delivery.needsAddress && <AddressFields />}
            </fieldset>

            {submitError && <p className="checkout__error">{t('checkout.submitError')}</p>}

            <Button type="submit" disabled={isSubmitting} className="checkout__submit">
              {isSubmitting ? t('checkout.paying') : t('checkout.pay')}
            </Button>
          </form>
        </FormProvider>

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
