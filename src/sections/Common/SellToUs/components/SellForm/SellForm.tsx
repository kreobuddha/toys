import './SellForm.scss';
import { useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useErrorMessage, useValidationMessage } from '@/i18n/errorLabels';
import type { ISubmitOfferRequest } from '@/types/sellToys';
import { errorReasonOf, fieldViolationsOf } from '@/utils/apiError';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import Textarea from '@components/Textarea/Textarea';
import { useSubmitOfferMutation } from '@sections/Common/api/sellToysApi';

interface SellFormFields {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Rejected fields the form can point at; anything else reads as a general failure. */
const FORM_FIELDS = ['name', 'email', 'phone'] as const;

const SellForm = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const validationMessage = useValidationMessage();
  const errorMessage = useErrorMessage();
  const [submitOffer, { isLoading, isSuccess }] = useSubmitOfferMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SellFormFields>({
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  const onSubmit = async (form: SellFormFields): Promise<void> => {
    setSubmitError(null);
    const offer: ISubmitOfferRequest = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      // The form does not ask how the toys reach the shop yet, and the contract requires it.
      deliveryInfo: { pickupPoint: {} },
      description: form.message,
    };
    try {
      await submitOffer(offer).unwrap();
    } catch (error) {
      const violations = fieldViolationsOf(error);
      const named = FORM_FIELDS.filter((field) => violations[field]);
      for (const field of named) {
        setError(field, { message: validationMessage(violations[field]) });
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
          aria-invalid={Boolean(errors.phone)}
          {...register('phone', { required: t('sellToUs.required') })}
        />
        {errors.phone && <span className="sell-form__error">{errors.phone.message}</span>}
      </div>
      <div className="sell-form__field">
        <Textarea
          id="sell-message"
          label={t('sellToUs.message')}
          placeholder={t('sellToUs.messagePlaceholder')}
          aria-invalid={Boolean(errors.message)}
          {...register('message', { required: t('sellToUs.required') })}
        />
        {errors.message && <span className="sell-form__error">{errors.message.message}</span>}
      </div>

      {submitError && <p className="sell-form__error">{submitError}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? t('sellToUs.sending') : t('sellToUs.submit')}
      </Button>
    </form>
  );
};

export default SellForm;
