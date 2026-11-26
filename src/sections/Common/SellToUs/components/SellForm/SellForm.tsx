import './SellForm.scss';
import { useState, type ReactElement } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useErrorMessage, useValidationMessage } from '@/i18n/errorLabels';
import type { ISubmitOfferRequest } from '@/types/sellToys';
import { errorReasonOf, fieldViolationsOf } from '@/utils/apiError';
import AddressFields, { type AddressFormValues } from '@components/AddressFields/AddressFields';
import { toAddress } from '@components/AddressFields/toAddress';
import { DEFAULT_CITY, loadSavedCity } from '@components/AddressFields/savedCity';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import Textarea from '@components/Textarea/Textarea';
import Radio from '@components/Radio/Radio';
import {
  useGetSellToysDeliveryOptionsQuery,
  useSubmitOfferMutation,
} from '@sections/Common/api/sellToysApi';

interface SellFormFields extends AddressFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  /** A pickup point id, or `home` for collection from the seller. */
  delivery: string;
  deliveryNotes: string;
}

const HOME_COLLECTION = 'home';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fields the form can point at by the path the backend rejects; anything else reads general. */
const FORM_FIELDS = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  description: 'message',
  'deliveryInfo.homeCollection.address.city': 'city',
  'deliveryInfo.homeCollection.address.street': 'addressLine',
  'deliveryInfo.homeCollection.address.houseNumber': 'addressLine',
  'deliveryInfo.homeCollection.address.postalCode': 'postcode',
} as const satisfies Record<string, keyof SellFormFields>;

type FieldPath = keyof typeof FORM_FIELDS;

const SellForm = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const validationMessage = useValidationMessage();
  const errorMessage = useErrorMessage();
  const { data: options } = useGetSellToysDeliveryOptionsQuery();
  const [submitOffer, { isLoading, isSuccess }] = useSubmitOfferMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [initialCity] = useState(() => loadSavedCity() ?? DEFAULT_CITY);
  // One identifier per filled-in form, so a retry after a failure creates no second offer.
  const [requestId] = useState(() => crypto.randomUUID());

  const pickupPoints = (options?.deliveryOptions ?? []).flatMap((option) =>
    option.pickupPoint ? [option.pickupPoint] : []
  );
  const homeCollection = (options?.deliveryOptions ?? []).find(
    (option) => option.homeCollection
  )?.homeCollection;

  const form = useForm<SellFormFields>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      delivery: '',
      deliveryNotes: '',
      city: initialCity.name,
      cityPick: initialCity,
      addressLine: '',
      addressPick: null,
      apartment: '',
      postcode: '',
      postcodeAuto: '',
    },
  });
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = form;

  const delivery = useWatch({ control, name: 'delivery' });
  const collectsAtHome = delivery === HOME_COLLECTION;

  const onSubmit = async (values: SellFormFields): Promise<void> => {
    setSubmitError(null);
    const address = collectsAtHome ? toAddress(values) : undefined;
    if (collectsAtHome && !address) return;

    const offer: ISubmitOfferRequest = {
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      deliveryInfo: address
        ? { homeCollection: { address, deliveryNotes: values.deliveryNotes || undefined } }
        : { pickupPoint: { pickupPointId: values.delivery } },
      description: values.message,
      requestId,
    };

    try {
      await submitOffer(offer).unwrap();
    } catch (error) {
      const violations = fieldViolationsOf(error);
      const named = Object.entries(violations).reduce<[keyof SellFormFields, string][]>(
        (list, [path, reason]) => {
          if (path in FORM_FIELDS) return [...list, [FORM_FIELDS[path as FieldPath], reason]];
          return path.startsWith('deliveryInfo') ? [...list, ['delivery', reason]] : list;
        },
        []
      );
      for (const [field, reason] of named) {
        setError(field, { message: validationMessage(reason) });
      }
      const reason = errorReasonOf(error);
      const failure = reason ? errorMessage(reason) : t('sellToUs.error');
      setSubmitError(named.length > 0 ? null : failure);
    }
  };

  if (isSuccess) {
    return (
      <p className="sell-form__success" role="status">
        {t('sellToUs.success')}
      </p>
    );
  }

  return (
    <FormProvider {...form}>
      <form className="sell-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="sell-form__row">
          <div className="sell-form__field">
            <Input
              id="sell-name"
              label={t('sellToUs.name')}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              {...register('name', { required: t('sellToUs.required') })}
            />
            {errors.name && <span className="sell-form__error">{errors.name.message}</span>}
          </div>
          <div className="sell-form__field">
            <Input
              id="sell-email"
              type="email"
              label={t('sellToUs.email')}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register('email', {
                required: t('sellToUs.required'),
                pattern: { value: EMAIL_PATTERN, message: t('sellToUs.invalidEmail') },
              })}
            />
            {errors.email && <span className="sell-form__error">{errors.email.message}</span>}
          </div>
        </div>
        <div className="sell-form__field">
          <Input
            id="sell-phone"
            type="tel"
            label={t('sellToUs.phone')}
            autoComplete="tel"
            {...register('phone')}
          />
        </div>
        <div className="sell-form__field">
          <Textarea
            id="sell-message"
            rows={4}
            label={t('sellToUs.message')}
            placeholder={t('sellToUs.messagePlaceholder')}
            aria-invalid={Boolean(errors.message)}
            {...register('message', { required: t('sellToUs.required') })}
          />
          {errors.message && <span className="sell-form__error">{errors.message.message}</span>}
        </div>

        {(pickupPoints.length > 0 || homeCollection) && (
          <fieldset className="sell-form__fieldset">
            <legend className="sell-form__legend">{t('sellToUs.delivery')}</legend>
            <div className="sell-form__options">
              {pickupPoints.map((point) => (
                <label
                  key={point.pickupPointId}
                  className={clsx(
                    'sell-form__option',
                    delivery === point.pickupPointId && 'sell-form__option--selected'
                  )}
                >
                  <Radio
                    value={point.pickupPointId}
                    {...register('delivery', { required: t('sellToUs.required') })}
                  />
                  <span className="sell-form__option-body">
                    <span className="sell-form__option-name">{point.name}</span>
                    <span className="sell-form__option-hint">
                      {[point.address.street, point.address.houseNumber].join(' ')},{' '}
                      {point.address.city}
                    </span>
                    {point.description && (
                      <span className="sell-form__option-hint">{point.description}</span>
                    )}
                  </span>
                </label>
              ))}
              {homeCollection && (
                <label
                  className={clsx(
                    'sell-form__option',
                    collectsAtHome && 'sell-form__option--selected'
                  )}
                >
                  <Radio
                    value={HOME_COLLECTION}
                    {...register('delivery', { required: t('sellToUs.required') })}
                  />
                  <span className="sell-form__option-body">
                    <span className="sell-form__option-name">{t('sellToUs.deliveryHome')}</span>
                    <span className="sell-form__option-hint">
                      {homeCollection.description ?? t('sellToUs.deliveryHomeHint')}
                    </span>
                  </span>
                </label>
              )}
            </div>
            {errors.delivery && <span className="sell-form__error">{errors.delivery.message}</span>}

            {collectsAtHome && (
              <div className="sell-form__address">
                <AddressFields />
                <div className="sell-form__field">
                  <Textarea
                    id="sell-delivery-notes"
                    label={t('sellToUs.deliveryNotes')}
                    placeholder={t('sellToUs.deliveryNotesPlaceholder')}
                    {...register('deliveryNotes')}
                  />
                </div>
              </div>
            )}
          </fieldset>
        )}

        {submitError && <p className="sell-form__error">{submitError}</p>}

        <Button type="submit" loading={isLoading}>
          {isLoading ? t('sellToUs.sending') : t('sellToUs.submit')}
        </Button>
      </form>
    </FormProvider>
  );
};

export default SellForm;
