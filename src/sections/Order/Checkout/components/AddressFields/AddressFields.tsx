import './AddressFields.scss';
import { useMemo, useState, type ReactElement } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  formatPostcode,
  isNlPostcode,
  resolveStreet,
  type IAddressPick,
  type INlCity,
} from '@/api/nlAddress';
import {
  useLazySuggestNlCitiesQuery,
  useSuggestNlCitiesQuery,
  useSuggestNlStreetsQuery,
  type INlStreetQuery,
  type INlStreetSuggestion,
} from '@/api/pdokApi';
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
  /** The picked "street + house number" row; it applies while the line still shows its label. */
  addressPick: IAddressPick | null;
  apartment: string;
  postcode: string;
}

interface CityOption extends ComboboxOption {
  city: INlCity;
}

interface StreetOption extends ComboboxOption {
  row: INlStreetSuggestion;
}

const SUGGEST_DELAY_MS = 250;
const MIN_CITY_QUERY_LENGTH = 2;
const MIN_STREET_QUERY_LENGTH = 3;
const MAX_STREET_OPTIONS = 8;

const toCityQuery = (text: string): string => text.trim().toLowerCase();

const isSameCity = (text: string, city: INlCity | null): city is INlCity =>
  city !== null && toCityQuery(text) === city.name.toLowerCase();

/** Addresses once the line has a house number, street names before it, nothing without a city. */
const toStreetQuery = (
  cityCode: string | undefined,
  line: string,
  pick: IAddressPick | null
): INlStreetQuery | undefined => {
  if (!cityCode) return undefined;
  const parts = resolveStreet(line, pick);
  if (parts) return { cityCode, street: parts.street, houseNumber: parts.houseNumber };
  const street = line.trim();
  return street.length >= MIN_STREET_QUERY_LENGTH ? { cityCode, street } : undefined;
};

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
  const {
    field: { ref: addressLineInputRef, ...addressLineField },
  } = useController({
    control,
    name: 'addressLine',
    rules: {
      required: t('checkout.required'),
      validate: (line, values) =>
        Boolean(resolveStreet(line, values.addressPick)) || t('checkout.invalidAddressLine'),
    },
  });
  const [cityPick, addressPick] = useWatch({ control, name: ['cityPick', 'addressPick'] });
  const cityCode = isSameCity(cityField.value, cityPick) ? cityPick.code : undefined;

  // City suggestions follow what the customer types, so opening the checkout sends no request.
  const [cityQuery, setCityQuery] = useState('');
  const debouncedCityQuery = useDebouncedValue(cityQuery, SUGGEST_DELAY_MS);
  const cityLookup = useSuggestNlCitiesQuery(
    debouncedCityQuery.length >= MIN_CITY_QUERY_LENGTH ? debouncedCityQuery : skipToken
  );
  const [findCities] = useLazySuggestNlCitiesQuery();
  // A skipped query keeps reporting its last success, so "answered" also needs a query for the text.
  const hasCityQuery = cityQuery.length >= MIN_CITY_QUERY_LENGTH;
  const cityPending = hasCityQuery && cityQuery !== debouncedCityQuery;

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

  // Street suggestions follow the line itself, whether typed or picked.
  const debouncedLine = useDebouncedValue(addressLineField.value, SUGGEST_DELAY_MS);
  const streetQuery = toStreetQuery(cityCode, debouncedLine, addressPick);
  const streetLookup = useSuggestNlStreetsQuery(streetQuery ?? skipToken);
  const hasStreetQuery = toStreetQuery(cityCode, addressLineField.value, addressPick) !== undefined;
  const streetLoading =
    hasStreetQuery && (addressLineField.value !== debouncedLine || streetLookup.isFetching);

  const streetOptions = useMemo(
    (): StreetOption[] =>
      (streetLookup.currentData ?? []).slice(0, MAX_STREET_OPTIONS).map((row) => {
        const label =
          row.houseNumber === undefined ? row.street : `${row.street} ${row.houseNumber}`;
        const hint = row.postcodes.length === 1 ? formatPostcode(row.postcodes[0]) : undefined;
        return { id: label, label, hint, row };
      }),
    [streetLookup.currentData]
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
    const pick = getValues('cityPick');
    if (isSameCity(typed, pick)) {
      // The confirmed city typed in other letters: show it the way the register writes it.
      if (typed !== pick.name) cityField.onChange(pick.name);
      return;
    }
    const q = toCityQuery(typed);
    if (q.length < MIN_CITY_QUERY_LENGTH) return;
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

  const handleStreetSelect = ({ row, label }: StreetOption): void => {
    if (row.houseNumber === undefined) {
      // Only the street so far: the customer goes on with the house number.
      setValue('addressPick', null);
      addressLineField.onChange(`${row.street} `);
      return;
    }
    // The pick must be in place before the line is validated against it.
    setValue('addressPick', { label, street: row.street, houseNumber: row.houseNumber });
    addressLineField.onChange(label);
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
          answered={hasCityQuery && cityLookup.isSuccess && !cityPending && !cityLookup.isFetching}
          autoComplete="address-level2"
          aria-invalid={Boolean(errors.city)}
        />
        {errors.city && <span className="address-fields__error">{errors.city.message}</span>}
      </div>
      <div className="address-fields__field">
        <Combobox
          id="addressLine"
          label={t('checkout.addressLine')}
          placeholder={t('checkout.addressLinePlaceholder')}
          name={addressLineField.name}
          ref={addressLineInputRef}
          value={addressLineField.value}
          onChange={addressLineField.onChange}
          onBlur={addressLineField.onBlur}
          options={streetOptions}
          onSelect={handleStreetSelect}
          loading={streetLoading}
          answered={hasStreetQuery && streetLookup.isSuccess && !streetLoading}
          autoComplete="address-line1"
          aria-invalid={Boolean(errors.addressLine)}
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
