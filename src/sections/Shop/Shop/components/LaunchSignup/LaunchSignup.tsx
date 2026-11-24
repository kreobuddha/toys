import './LaunchSignup.scss';
import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLinks } from '@/app/useLinks';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import { useSubscribeToLaunchMutation } from '@sections/Shop/api/launchApi';

interface LaunchForm {
  email: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Stands in for the catalog until the shop opens: the date and an email signup. */
const LaunchSignup = (): ReactElement => {
  const { t } = useTranslation('shopSection');
  const links = useLinks();
  const [subscribe] = useSubscribeToLaunchMutation();
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LaunchForm>({ defaultValues: { email: '' } });

  const onSubmit = async ({ email }: LaunchForm): Promise<void> => {
    setFailed(false);
    try {
      await subscribe({ email: email.trim() }).unwrap();
      setDone(true);
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className="launch-signup">
      <h2 className="launch-signup__title">{t('launch.title')}</h2>
      {done ? (
        <p className="launch-signup__done" role="status">
          {t('launch.done')}
        </p>
      ) : (
        <>
          <p className="launch-signup__text">{t('launch.text')}</p>
          <form className="launch-signup__form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              id="launch-email"
              type="email"
              autoComplete="email"
              placeholder={t('launch.email')}
              aria-label={t('launch.email')}
              error={errors.email?.message ?? (failed ? t('launch.error') : undefined)}
              className="launch-signup__input"
              {...register('email', {
                required: t('launch.emailRequired'),
                pattern: { value: EMAIL_PATTERN, message: t('launch.emailInvalid') },
              })}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('launch.sending') : t('launch.submit')}
            </Button>
          </form>
        </>
      )}
      <p className="launch-signup__sell">
        {t('launch.sellQuestion')}
        <br />
        <Link to={links.sellToUs}>{t('launch.sellLink')}</Link>
      </p>
    </div>
  );
};

export default LaunchSignup;
