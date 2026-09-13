import './Checkout.scss';
import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { DeliveryMethod, ICreateOrderInput, INlAddress } from '@/api/types';
import { useCreateOrderMutation } from '@/api/api';
import { matchNlAddress, normalizeAddition, toNlAddressQuery } from '@/api/nlAddress';
import { useLazyLookupNlAddressQuery } from '@/api/pdokApi';
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

const Checkout = (): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const links = useLinks();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const currency = items[0]?.currency ?? 'EUR';
  const [createOrder] = useCreateOrderMutation();
  const [lookupAddress] = useLazyLookupNlAddressQuery();
  const [submitError, setSubmitError] = useState(false);

  const form = useForm<CheckoutForm>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      delivery: 'pickup',
      postcode: '',
      houseNumber: '',
      addition: '',
      street: '',
      city: '',
    },
  });
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const deliveryMethod = useWatch({ control, name: 'delivery' });
  const delivery = DELIVERY_OPTIONS.find((o) => o.method === deliveryMethod) ?? DELIVERY_OPTIONS[0];

  /**
   * Checks the address against the BAG before the order goes out, reusing the lookup the fields
   * already made. Returns undefined once the form points at the problem.
   */
  const resolveAddress = async (values: CheckoutForm): Promise<INlAddress | undefined> => {
    // Field validation stops malformed postcodes and house numbers before this point.
    const query = toNlAddressQuery(values.postcode, values.houseNumber);
    if (!query) return undefined;
    try {
      const match = matchNlAddress(await lookupAddress(query, true).unwrap(), values.addition);
      if (match.status === 'found') return match.option.address;
      if (match.status === 'notFound') {
        setError(
          'houseNumber',
          { type: 'lookup', message: t('checkout.addressNotFound') },
          { shouldFocus: true }
        );
      } else {
        setError(
          'addition',
          {
            type: 'lookup',
            message: t('checkout.additionRequired', { additions: match.additions.join(', ') }),
          },
          { shouldFocus: true }
        );
      }
      return undefined;
    } catch {
      // PDOK is unavailable, so the fields ask for street and city instead.
      const street = values.street.trim();
      const city = values.city.trim();
      if (!street || !city) {
        setError(
          street ? 'city' : 'street',
          { type: 'required', message: t('checkout.required') },
          { shouldFocus: true }
        );
        return undefined;
      }
      const addition = normalizeAddition(values.addition) || undefined;
      return { ...query, addition, street, city, country: 'NL' };
    }
  };

  const onSubmit = async (values: CheckoutForm): Promise<void> => {
    setSubmitError(false);
    const address = delivery.needsAddress ? await resolveAddress(values) : undefined;
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
