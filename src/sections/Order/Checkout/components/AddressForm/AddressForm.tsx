import './AddressForm.scss';
import { useEffect, useRef, type ReactElement } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useLookupNlAddressQuery } from '@/api/pdokApi';
import { isNlPostcode, normalizePostcode } from '@/utils/nlAddress';
import { useDebouncedValue } from '@components/AddressFields/useDebouncedValue';
import Input from '@components/Input/Input';
import { parseHouseNumber, type CheckoutFormValues } from '@sections/Order/Checkout/checkoutForm';
import Textarea from '@components/Textarea/Textarea';

const LOOKUP_DELAY_MS = 300;

/**
 * Postcode and house number first, as Dutch addresses go. Once both are valid the register fills
 * in the street and the city; the customer can still overwrite them, and a missing lookup never
 * blocks the order.
 */
const AddressForm = (): ReactElement => {
  const { t } = useTranslation('orderSection');
  const {
    register,
    control,
    getValues,
    getFieldState,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();
  // Undefined until the fields mount: the form unregisters hidden ones.
  const [postcode = '', houseNumber = ''] = useWatch({
    control,
    name: ['postcode', 'houseNumber'],
  });

  const house = parseHouseNumber(houseNumber);
  const lookupKey =
    isNlPostcode(postcode) && house ? `${normalizePostcode(postcode)}|${house.number}` : '';
  const debouncedKey = useDebouncedValue(lookupKey, LOOKUP_DELAY_MS);
  const [lookupPostcode, lookupNumber] = debouncedKey.split('|');
  const { data: found } = useLookupNlAddressQuery(
    debouncedKey ? { postcode: lookupPostcode, houseNumber: Number(lookupNumber) } : skipToken
  );

  // Values the form filled in itself; a field still holding one may be refilled.
  const filled = useRef({ street: '', city: '' });
  useEffect(() => {
    if (!found) return;
    for (const field of ['street', 'city'] as const) {
      const current = getValues(field).trim();
      if (current === found[field]) continue;
      if (current === '' || current === filled.current[field]) {
        setValue(field, found[field], { shouldValidate: getFieldState(field).invalid });
        filled.current[field] = found[field];
      }
    }
  }, [found, getValues, getFieldState, setValue]);

  return (
    <fieldset className="address-form">
      <legend className="address-form__title">{t('checkout.address')}</legend>
      <div className="address-form__row">
        <Input
          reserveError
          id="postcode"
          label={t('checkout.postcode')}
          placeholder={t('checkout.postcodePlaceholder')}
          autoComplete="postal-code"
          error={errors.postcode?.message}
          {...register('postcode', {
            required: t('checkout.errors.postcodeRequired'),
            validate: (value) => isNlPostcode(value) || t('checkout.errors.postcodeInvalid'),
          })}
        />
        <Input
          reserveError
          id="houseNumber"
          label={t('checkout.houseNumber')}
          placeholder={t('checkout.houseNumber')}
          error={errors.houseNumber?.message}
          {...register('houseNumber', {
            required: t('checkout.errors.houseNumberRequired'),
            validate: (value) =>
              Boolean(parseHouseNumber(value)) || t('checkout.errors.houseNumberInvalid'),
          })}
        />
      </div>
      <Input
        reserveError
        id="street"
        label={t('checkout.street')}
        placeholder={t('checkout.street')}
        autoComplete="address-line1"
        error={errors.street?.message}
        {...register('street', { required: t('checkout.errors.streetRequired') })}
      />
      <Input
        reserveError
        id="city"
        label={t('checkout.city')}
        placeholder={t('checkout.city')}
        autoComplete="address-level2"
        error={errors.city?.message}
        {...register('city', { required: t('checkout.errors.cityRequired') })}
      />
      <Textarea
        id="deliveryNotes"
        rows={2}
        label={t('checkout.deliveryNotes')}
        placeholder={t('checkout.deliveryNotesPlaceholder')}
        {...register('deliveryNotes')}
      />
    </fieldset>
  );
};

export default AddressForm;
