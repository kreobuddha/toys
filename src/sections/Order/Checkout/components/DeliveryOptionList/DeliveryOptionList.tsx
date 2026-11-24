import './DeliveryOptionList.scss';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { CURRENCY } from '@/constants/productAttributes';
import { formatPrice, useLocale } from '@/i18n';
import type { CheckoutFormValues } from '@sections/Order/Checkout/checkoutForm';
import type { DeliveryType, IDeliveryChoice } from '@sections/Order/Checkout/deliveryOptions';

interface DeliveryOptionListProps {
  choices: IDeliveryChoice[];
}

// Explicit map so the keys stay type-checked against the translation file.
const LABELS = {
  DELIVERY_OPTION_TYPE_LOCAL_DELIVERY: 'local',
  DELIVERY_OPTION_TYPE_POSTNL_PICKUP_POINT: 'pickupPoint',
  DELIVERY_OPTION_TYPE_POSTNL_HOME: 'home',
  DELIVERY_OPTION_TYPE_CUSTOMER_PICKUP: 'customerPickup',
} as const satisfies Record<DeliveryType, string>;

/** Delivery methods as radio cards: name, timing and price. */
const DeliveryOptionList = ({ choices }: DeliveryOptionListProps): ReactElement => {
  const { t } = useTranslation('orderSection');
  const locale = useLocale();
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();
  const selected = watch('delivery');
  const error = errors.delivery?.message;

  return (
    <fieldset className="delivery-options" aria-invalid={error ? true : undefined}>
      <legend className="delivery-options__title">{t('checkout.delivery')}</legend>
      <div className="delivery-options__list">
        {choices.map((choice) => (
          <label
            key={choice.type}
            className={clsx(
              'delivery-options__option',
              selected === choice.type && 'delivery-options__option--selected'
            )}
          >
            <input
              type="radio"
              value={choice.type}
              className="delivery-options__radio"
              {...register('delivery', { required: t('checkout.errors.deliveryRequired') })}
            />
            <span className="delivery-options__details">
              <span className="delivery-options__name">
                {t(`checkout.methods.${LABELS[choice.type]}.name`)}
              </span>
              <span className="delivery-options__hint">
                {t(`checkout.methods.${LABELS[choice.type]}.hint`)}
              </span>
            </span>
            <span className="delivery-options__price">
              {choice.price === 0
                ? t('checkout.free')
                : formatPrice(choice.price, CURRENCY, locale)}
            </span>
          </label>
        ))}
      </div>
      {error && <p className="delivery-options__error">{error}</p>}
    </fieldset>
  );
};

export default DeliveryOptionList;
