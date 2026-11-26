import './PickupPointPicker.scss';
import { useState, type ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { formatPostcode, isNlPostcode, normalizePostcode } from '@/utils/nlAddress';
import type { IAddress } from '@/types/address';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import { useLazyListPickupPointsQuery } from '@sections/Order/api/ordersApi';
import type { CheckoutFormValues } from '@sections/Order/Checkout/checkoutForm';

/** "Dam 1, 1012 JS, Amsterdam" */
const formatAddress = (address: IAddress): string =>
  [
    [address.street, address.houseNumber, address.houseNumberAddition].filter(Boolean).join(' '),
    address.postalCode && formatPostcode(address.postalCode),
    address.city,
  ]
    .filter(Boolean)
    .join(', ');

/** Postcode search for PostNL pickup points, then a radio card per point. */
const PickupPointPicker = (): ReactElement => {
  const { t } = useTranslation('orderSection');
  const {
    register,
    getValues,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();
  const [search, { data, isFetching, isError }] = useLazyListPickupPointsQuery();
  const [searched, setSearched] = useState(false);
  const selected = watch('pickupPoint');
  const points = data?.pickupPoints ?? [];

  const handleSearch = async (): Promise<void> => {
    if (!(await trigger('pickupPostcode'))) return;
    setValue('pickupPoint', '');
    setSearched(true);
    void search({ searchAddress: { postalCode: normalizePostcode(getValues('pickupPostcode')) } });
  };

  const notFound = searched && !isFetching && (isError || points.length === 0);

  return (
    <div className="pickup-picker">
      <div className="pickup-picker__intro">
        <h3 className="pickup-picker__title">{t('checkout.pickupTitle')}</h3>
        <p className="pickup-picker__text">{t('checkout.pickupGuidance')}</p>
      </div>
      <div className="pickup-picker__search">
        <Input
          reserveError
          id="pickupPostcode"
          label={t('checkout.postcode')}
          placeholder={t('checkout.postcodePlaceholder')}
          autoComplete="postal-code"
          error={errors.pickupPostcode?.message}
          className="pickup-picker__postcode"
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            void handleSearch();
          }}
          {...register('pickupPostcode', {
            validate: (value) =>
              value.trim() === ''
                ? t('checkout.errors.postcodeRequired')
                : isNlPostcode(value) || t('checkout.errors.postcodeInvalid'),
          })}
        />
        <Button
          className="pickup-picker__button"
          loading={isFetching}
          onClick={() => void handleSearch()}
        >
          {isFetching ? t('checkout.pickupSearching') : t('checkout.pickupSearch')}
        </Button>
        {notFound && !errors.pickupPostcode && (
          <p className="pickup-picker__error" role="alert">
            {t('checkout.pickupNotFound')}
          </p>
        )}
      </div>

      {!isFetching && points.length > 0 && (
        <fieldset className="pickup-picker__results">
          <legend className="pickup-picker__results-title">{t('checkout.pickupResults')}</legend>
          <div className="pickup-picker__list">
            {points.map((point) => (
              <label
                key={point.locationCode}
                className={clsx(
                  'pickup-picker__point',
                  selected === point.locationCode && 'pickup-picker__point--selected'
                )}
              >
                <input
                  type="radio"
                  value={point.locationCode}
                  className="pickup-picker__radio"
                  {...register('pickupPoint', { required: t('checkout.errors.pickupRequired') })}
                />
                <span className="pickup-picker__details">
                  <span className="pickup-picker__name">{point.name}</span>
                  <span className="pickup-picker__address">{formatAddress(point.address)}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {errors.pickupPoint && points.length > 0 && (
        <p className="pickup-picker__error">{errors.pickupPoint.message}</p>
      )}
    </div>
  );
};

export default PickupPointPicker;
