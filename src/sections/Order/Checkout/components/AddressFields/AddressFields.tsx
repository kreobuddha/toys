import './AddressFields.scss';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isNlPostcode, parseAddressLine } from '@/api/nlAddress';
import Input from '@components/Input/Input';

export interface AddressFormValues {
  city: string;
  /** Street and house number in one line: "Herengracht 611". */
  addressLine: string;
  apartment: string;
  postcode: string;
}

/**
 * Dutch delivery address. Only formats are checked here: the order never waits for an address
 * lookup, and the backend validates the address itself.
 */
const AddressFields = (): ReactElement => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<AddressFormValues>();

  return (
    <div className="address-fields">
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
      <div className="address-fields__field">
        <Input
          id="addressLine"
          label={t('checkout.addressLine')}
          placeholder={t('checkout.addressLinePlaceholder')}
          autoComplete="address-line1"
          aria-invalid={Boolean(errors.addressLine)}
          {...register('addressLine', {
            required: t('checkout.required'),
            validate: (value) =>
              Boolean(parseAddressLine(value)) || t('checkout.invalidAddressLine'),
          })}
        />
        {errors.addressLine && (
          <span className="address-fields__error">{errors.addressLine.message}</span>
        )}
      </div>
      <div className="address-fields__row">
        <div className="address-fields__field">
          <Input
            id="apartment"
            label={t('checkout.apartment')}
            autoComplete="address-line2"
            {...register('apartment')}
          />
        </div>
        <div className="address-fields__field">
          <Input
            id="postcode"
            label={t('checkout.postcode')}
            autoComplete="postal-code"
            autoCapitalize="characters"
            aria-invalid={Boolean(errors.postcode)}
            {...register('postcode', {
              required: t('checkout.required'),
              validate: (value) => isNlPostcode(value) || t('checkout.invalidPostcode'),
            })}
          />
          {errors.postcode && (
            <span className="address-fields__error">
              {errors.postcode.message}
              {errors.postcode.type === 'validate' && ` ${t('checkout.nlOnly')}`}
            </span>
          )}
        </div>
      </div>
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
