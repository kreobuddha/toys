import './AddressFields.scss';
import { useMemo, useState, type ReactElement } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { isNlPostcode, parseAddressLine, type INlCity } from '@/api/nlAddress';
import { useLazySuggestNlCitiesQuery, useSuggestNlCitiesQuery } from '@/api/pdokApi';
import Combobox, { type ComboboxOption } from '@components/Combobox/Combobox';
import Input from '@components/Input/Input';
import { saveCity } from './savedCity';
import { useDebouncedValue } from './useDebouncedValue';

export interface AddressFormValues {
  city: string;
  /** The city confirmed from suggestions; its code applies while `city` still shows its name. */
  cityPick: INlCity | null;
  /** Street and house number in one line: "Herengracht 611". */
  addressLine: string;
  apartment: string;
  postcode: string;
}

interface CityOption extends ComboboxOption {
  city: INlCity;
}

const SUGGEST_DELAY_MS = 250;
const MIN_CITY_QUERY_LENGTH = 2;

const toCityQuery = (text: string): string => text.trim().toLowerCase();

const isSameCity = (text: string, city: INlCity | null): city is INlCity =>
  city !== null && toCityQuery(text) === city.name.toLowerCase();

/**
 * Dutch delivery address. Suggestions only help: the order never waits for them, only formats are
 * checked, and the backend validates the address itself.
 */
const AddressFields = (): ReactElement => {
  const { t } = useTranslation();
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<AddressFormValues>();
  const {
    field: { ref: cityInputRef, ...cityField },
  } = useController({
    control,
    name: 'city',
    rules: { required: t('checkout.required') },
  });

  // City suggestions follow what the customer types, so opening the checkout sends no request.
  const [cityQuery, setCityQuery] = useState('');
  const debouncedCityQuery = useDebouncedValue(cityQuery, SUGGEST_DELAY_MS);
  const cityLookup = useSuggestNlCitiesQuery(
    debouncedCityQuery.length >= MIN_CITY_QUERY_LENGTH ? debouncedCityQuery : skipToken
  );
  const [findCities] = useLazySuggestNlCitiesQuery();
  const cityPending = cityQuery.length >= MIN_CITY_QUERY_LENGTH && cityQuery !== debouncedCityQuery;

  const cityOptions = useMemo(
    (): CityOption[] =>
      (cityLookup.currentData ?? []).map((city) => ({
        id: city.code,
        label: city.name,
        hint:
          city.municipality === city.name
            ? city.province
            : `${city.municipality}, ${city.province}`,
        city: { name: city.name, code: city.code },
      })),
    [cityLookup.currentData]
  );

  const confirmCity = (city: INlCity): void => {
    setValue('cityPick', city);
    cityField.onChange(city.name);
    saveCity(city);
  };

  const handleCityChange = (text: string): void => {
    cityField.onChange(text);
    setCityQuery(toCityQuery(text));
  };

  // A city typed in full counts as picked when exactly one locality has that name.
  const handleCityBlur = async (): Promise<void> => {
    cityField.onBlur();
    const typed = getValues('city');
    const q = toCityQuery(typed);
    if (q.length < MIN_CITY_QUERY_LENGTH || isSameCity(typed, getValues('cityPick'))) return;
    try {
      const cities = await findCities(q, true).unwrap();
      const matches = cities.filter((city) => city.name.toLowerCase() === q);
      // The customer may have typed on while the lookup ran.
      if (matches.length === 1 && getValues('city') === typed) {
        confirmCity({ name: matches[0].name, code: matches[0].code });
      }
    } catch {
      // No answer: the city stays as typed, just without street suggestions.
    }
  };

  return (
    <div className="address-fields">
      <div className="address-fields__field">
        <Combobox
          id="city"
          label={t('checkout.city')}
          name={cityField.name}
          ref={cityInputRef}
          value={cityField.value}
          onChange={handleCityChange}
          onBlur={() => void handleCityBlur()}
          options={cityOptions}
          onSelect={(option) => confirmCity(option.city)}
          loading={cityPending || cityLookup.isFetching}
          answered={cityLookup.isSuccess && !cityPending && !cityLookup.isFetching}
          autoComplete="address-level2"
          aria-invalid={Boolean(errors.city)}
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
