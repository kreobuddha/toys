import './PaymentResult.scss';
import type { ReactElement } from 'react';
import ButtonLink from '@components/ButtonLink/ButtonLink';

interface PaymentResultProps {
  variant: 'paid' | 'failed';
  title: string;
  text: string;
  action: { to: string; label: string };
}

const ICONS = {
  paid: '/icons/payment-ok.svg',
  failed: '/icons/payment-failed.svg',
} as const;

/** The card the payment provider's return pages share: an icon, a heading, a line and a way on. */
const PaymentResult = ({ variant, title, text, action }: PaymentResultProps): ReactElement => {
  return (
    <section className="container payment-result">
      <div className="payment-result__card">
        <img src={ICONS[variant]} alt="" className="payment-result__icon" />
        <h1 className="payment-result__title">{title}</h1>
        <p className="payment-result__text">{text}</p>
        <ButtonLink to={action.to}>{action.label}</ButtonLink>
      </div>
    </section>
  );
};

export default PaymentResult;
