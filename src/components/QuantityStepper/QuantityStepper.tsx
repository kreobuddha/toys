import './QuantityStepper.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface QuantityStepperProps {
  value: number;
  /** Units the catalog still has; the plus button stops there. */
  max?: number;
  /** The new quantity; zero removes the toy from the cart. */
  onChange: (quantity: number) => void;
  size?: 'sm' | 'md';
  className?: string;
}

/** Minus, the quantity, plus. At one unit the minus button removes the toy. */
const QuantityStepper = ({
  value,
  max,
  onChange,
  size = 'md',
  className,
}: QuantityStepperProps): ReactElement => {
  const { t } = useTranslation();
  const atMax = max !== undefined && value >= max;
  const removes = value <= 1;

  return (
    <div
      role="group"
      aria-label={t('cart.quantity')}
      className={clsx('quantity-stepper', `quantity-stepper--${size}`, className)}
    >
      <button
        type="button"
        className="quantity-stepper__button"
        aria-label={removes ? t('cart.remove') : t('cart.decrease')}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span className="quantity-stepper__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="quantity-stepper__button"
        aria-label={t('cart.increase')}
        disabled={atMax}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
};

export default QuantityStepper;
