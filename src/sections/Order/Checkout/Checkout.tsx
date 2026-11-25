import './Checkout.scss';
import { useMemo, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import {
  removeItem,
  selectCartItems,
  selectCartTotal,
  setPrice,
  setQuantity,
} from '@/features/cart/cartSlice';
import { useErrorMessage, useValidationMessage } from '@/i18n/errorLabels';
import type { ICreateOrderRequest, IPreviewCartRequest } from '@/types/order';
import { errorReasonOf, fieldViolationsOf } from '@/utils/apiError';
import BackgroundShapes from '@components/BackgroundShapes/BackgroundShapes';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import { useCreateOrderMutation, usePreviewCartQuery } from '@sections/Order/api/ordersApi';
import { saveLastOrder } from '@sections/Order/lastOrder';
import { problemOf } from './cartProblems';
import { CHECKOUT_DEFAULTS, toCheckoutAddress, type CheckoutFormValues } from './checkoutForm';
import { DESIGN_DELIVERY_CHOICES, needsAddress, toOrderDelivery } from './deliveryOptions';
import AddressForm from './components/AddressForm/AddressForm';
import CartNotice from './components/CartNotice/CartNotice';
import DeliveryOptionList from './components/DeliveryOptionList/DeliveryOptionList';
import OrderSummary from './components/OrderSummary/OrderSummary';
import PickupPointPicker from './components/PickupPointPicker/PickupPointPicker';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Rejected fields the form can point at; anything else reads as a general failure. */
const FORM_FIELDS = ['name', 'email', 'phone'] as const;

const Checkout = (): ReactElement => {
  const { t } = useTranslation(['orderSection', 'translation']);
  const validationMessage = useValidationMessage();
  const errorMessage = useErrorMessage();
  const links = useLinks();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const [createOrder] = useCreateOrderMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const previewRequest = useMemo(
    (): IPreviewCartRequest => ({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        knownUnitPriceEuroCents: item.price,
      })),
    }),
    [items]
  );
  const { data: preview } = usePreviewCartQuery(items.length > 0 ? previewRequest : skipToken);
  const previews = preview?.items ?? [];
  const problems = items.flatMap((item) => {
    const problem = problemOf(previews.find((p) => p.productId === item.productId));
    return problem ? [problem] : [];
  });

  // shouldUnregister drops the fields of a hidden block, so their rules stop applying.
  const form = useForm<CheckoutFormValues>({
    defaultValues: CHECKOUT_DEFAULTS,
    shouldUnregister: true,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;
  const delivery = useWatch({ control, name: 'delivery' }) ?? '';

  const choices = DESIGN_DELIVERY_CHOICES;
  const chosen = choices.find((choice) => choice.type === delivery);
  const blocked = problems.length > 0;

  const onSubmit = async (values: CheckoutFormValues): Promise<void> => {
    setSubmitError(null);
    if (!values.delivery) return;
    const address = needsAddress(values.delivery) ? toCheckoutAddress(values) : undefined;
    if (needsAddress(values.delivery) && !address) return;
    if (values.delivery === 'DELIVERY_OPTION_TYPE_POSTNL_PICKUP_POINT' && !values.pickupPoint) {
      form.setError('pickupPoint', { message: t('checkout.errors.pickupRequired') });
      return;
    }
    const order: ICreateOrderRequest = {
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      delivery: toOrderDelivery(values.delivery, address, values.pickupPoint, values.deliveryNotes),
    };
    try {
      const { orderId, checkoutUrl } = await createOrder(order).unwrap();
      saveLastOrder({ orderId, email: values.email });
      // Stripe Checkout is hosted off-site, so a full navigation is intended.
      window.location.assign(checkoutUrl);
    } catch (error) {
      const violations = fieldViolationsOf(error);
      const named = FORM_FIELDS.filter((field) => violations[field]);
      for (const field of named) {
        form.setError(field, { message: validationMessage(violations[field]) });
      }
      const reason = errorReasonOf(error);
      const failure = reason ? errorMessage(reason) : t('checkout.submitError');
      setSubmitError(named.length > 0 ? null : failure);
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

  const showDetails =
    needsAddress(delivery) || delivery === 'DELIVERY_OPTION_TYPE_POSTNL_PICKUP_POINT';

  return (
    <div className="checkout-page">
      <BackgroundShapes layout="empty" />
      <section className="container checkout">
        <h1 className="checkout__title">{t('checkout.title')}</h1>
        <CartNotice problems={problems} />
        <div className="checkout__layout">
          <FormProvider {...form}>
            <form className="checkout__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="checkout__card">
                <fieldset className="checkout__fieldset">
                  <legend className="checkout__legend">{t('checkout.contact')}</legend>
                  <Input
                    reserveError
                    id="name"
                    label={t('checkout.name')}
                    autoComplete="name"
                    error={errors.name?.message}
                    {...register('name', { required: t('checkout.errors.nameRequired') })}
                  />
                  <Input
                    reserveError
                    id="email"
                    type="email"
                    label={t('checkout.email')}
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email', {
                      required: t('checkout.errors.emailRequired'),
                      pattern: { value: EMAIL_PATTERN, message: t('checkout.errors.emailInvalid') },
                    })}
                  />
                  <Input
                    reserveError
                    id="phone"
                    type="tel"
                    label={t('checkout.phone')}
                    autoComplete="tel"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </fieldset>
                <DeliveryOptionList choices={choices} />
              </div>

              {showDetails && (
                <div className="checkout__card checkout__card--details">
                  <h2 className="checkout__legend">{t('checkout.details')}</h2>
                  {needsAddress(delivery) ? <AddressForm /> : <PickupPointPicker />}
                </div>
              )}

              {submitError && <p className="checkout__error">{submitError}</p>}

              <div className="checkout__submit">
                <Button type="submit" disabled={isSubmitting || blocked} aria-busy={isSubmitting}>
                  {isSubmitting ? t('checkout.paying') : t('checkout.pay')}
                </Button>
                {problems.length > 0 && (
                  <p className="checkout__blocked">{t('checkout.blocked')}</p>
                )}
              </div>
            </form>
          </FormProvider>

          <OrderSummary
            items={items}
            previews={previews}
            subtotal={subtotal}
            deliveryCost={chosen?.price}
            onRemove={(productId) => dispatch(removeItem(productId))}
            onSetQuantity={(productId, quantity) => dispatch(setQuantity({ productId, quantity }))}
            onAcceptPrice={(productId, price) => dispatch(setPrice({ productId, price }))}
          />
        </div>
      </section>
    </div>
  );
};

export default Checkout;
