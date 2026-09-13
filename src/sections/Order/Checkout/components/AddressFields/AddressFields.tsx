import './AddressFields.scss';
import type { ReactElement } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { isNlPostcode, parseHouseNumber } from '@/api/nlAddress';
import Input from '@components/Input/Input';
import { useAddressLookup } from './useAddressLookup';

export interface AddressFormValues {
  postcode: string;
  houseNumber: string;
  addition: string;
  street: string;
  city: string;
}

/**
 * Dutch delivery address. Postcode and house number fill in street and city from the BAG; the
 * visitor types those two only while the lookup is unavailable.
 */
const AddressFields = (): ReactElement => {
  const { t } = useTranslation();
  const {
    register,
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext<AddressFormValues>();
  const [postcode, houseNumber, addition] = useWatch({
    control,
    name: ['postcode', 'houseNumber', 'addition'],
  });
  const lookup = useAddressLookup(postcode, houseNumber, addition);

  // A failed check on submit is about the address as a whole; editing any part of it resets it.
  const clearLookupErrors = (): void => {
    if (errors.houseNumber?.type === 'lookup') clearErrors('houseNumber');
    if (errors.addition?.type === 'lookup') clearErrors('addition');
  };

  const status = ((): string => {
    switch (lookup.status) {
      case 'loading':
        return t('checkout.addressLookup');
      case 'found':
        return lookup.summary ?? '';
      case 'needsAddition':
        // After a submit the same message already sits under the field.
        return errors.addition
          ? ''
          : t('checkout.additionRequired', { additions: lookup.additions.join(', ') });
      case 'notFound':
        return errors.houseNumber ? '' : t('checkout.addressNotFound');
      case 'unavailable':
        return t('checkout.addressUnavailable');
      default:
        return '';
    }
  })();

  return (
    <div className="address-fields">
      <div className="address-fields__row">
        <div className="address-fields__field address-fields__field--postcode">
          <Input
            id="postcode"
            label={t('checkout.postcode')}
            autoComplete="postal-code"
            autoCapitalize="characters"
            aria-invalid={Boolean(errors.postcode)}
            {...register('postcode', {
              required: t('checkout.required'),
              validate: (value) => isNlPostcode(value) || t('checkout.invalidPostcode'),
              onChange: clearLookupErrors,
            })}
          />
          {errors.postcode && (
            <span className="address-fields__error">
              {errors.postcode.message}
              {errors.postcode.type === 'validate' && ` ${t('checkout.nlOnly')}`}
            </span>
          )}
        </div>
        <div className="address-fields__field">
          <Input
            id="houseNumber"
            label={t('checkout.houseNumber')}
            inputMode="numeric"
            aria-invalid={Boolean(errors.houseNumber)}
            {...register('houseNumber', {
              required: t('checkout.required'),
              validate: (value) =>
                parseHouseNumber(value) !== undefined || t('checkout.invalidHouseNumber'),
              onChange: clearLookupErrors,
            })}
          />
          {errors.houseNumber && (
            <span className="address-fields__error">{errors.houseNumber.message}</span>
          )}
        </div>
        <div className="address-fields__field">
          <Input
            id="addition"
            label={t('checkout.addition')}
            list="address-additions"
            autoCapitalize="characters"
            aria-invalid={Boolean(errors.addition)}
            {...register('addition', { onChange: clearLookupErrors })}
          />
          <datalist id="address-additions">
            {lookup.additions.map((value) => (
              <option key={value} value={value} />
            ))}
          </datalist>
          {errors.addition && (
            <span className="address-fields__error">{errors.addition.message}</span>
          )}
        </div>
      </div>

      <p
        className={clsx(
          'address-fields__status',
          lookup.status === 'found' && 'address-fields__status--found',
          (lookup.status === 'notFound' || lookup.status === 'needsAddition') &&
            'address-fields__status--problem'
        )}
        role="status"
      >
        {status}
      </p>

      {lookup.status === 'unavailable' && (
        <div className="address-fields__row address-fields__row--manual">
          <div className="address-fields__field">
            <Input
              id="street"
              label={t('checkout.street')}
              autoComplete="address-line1"
              aria-invalid={Boolean(errors.street)}
              {...register('street', { required: t('checkout.required') })}
            />
            {errors.street && (
              <span className="address-fields__error">{errors.street.message}</span>
            )}
          </div>
          <div className="address-fields__field">
            <Input
              id="city"
              label={t('checkout.city')}
              autoComplete="address-level2"
              aria-invalid={Boolean(errors.city)}
              {...register('city', { required: t('checkout.required') })}
            />
            {errors.city && <span className="address-fields__error">{errors.city.message}</span>}
          </div>
        </div>
      )}

      <Input
        id="country"
        label={t('checkout.country')}
        value={t('checkout.countryNetherlands')}
        readOnly
      />
    </div>
  );
};

export default AddressFields;
