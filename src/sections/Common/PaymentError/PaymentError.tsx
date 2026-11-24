import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useLinks } from '@/app/useLinks';
import PaymentResult from '@components/PaymentResult/PaymentResult';

/**
 * Where the payment provider sends the customer when the payment did not go through. The cart
 * stays as it was, so the customer can go back and try again.
 */
const PaymentError = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const links = useLinks();

  return (
    <PaymentResult
      variant="failed"
      title={t('success.failedTitle')}
      text={t('success.failedText')}
      action={{ to: links.checkout, label: t('success.backToCart') }}
    />
  );
};

export default PaymentError;
