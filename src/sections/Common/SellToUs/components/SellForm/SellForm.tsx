import './SellForm.scss';
import { useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { ISellRequestInput } from '@/api/types';
import { useSendSellRequestMutation } from '@/api/api';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import Textarea from '@components/Textarea/Textarea';

interface SellFormFields {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SellForm = (): ReactElement => {
  const { t } = useTranslation();
  const [sendRequest, { isLoading, isSuccess }] = useSendSellRequestMutation();
  const [submitError, setSubmitError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellFormFields>({
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  const onSubmit = async (form: SellFormFields): Promise<void> => {
    setSubmitError(false);
    const input: ISellRequestInput = {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      message: form.message,
    };
    try {
      await sendRequest(input).unwrap();
    } catch {
      setSubmitError(true);
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
          {...register('phone')}
        />
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

      {submitError && <p className="sell-form__error">{t('sellToUs.error')}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? t('sellToUs.sending') : t('sellToUs.submit')}
      </Button>
    </form>
  );
};

export default SellForm;
