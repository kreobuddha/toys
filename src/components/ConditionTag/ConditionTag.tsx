import './ConditionTag.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useProductLabels } from '@/i18n/productLabels';
import type { ProductCondition } from '@/types/product';

interface ConditionTagProps {
  condition?: ProductCondition;
  /** A sold-out toy shows that instead of its condition. */
  soldOut?: boolean;
  size?: 'md' | 'lg';
  className?: string;
}

/** The pill over a product photo: New, Pre-loved or Sold out. */
const ConditionTag = ({
  condition,
  soldOut = false,
  size = 'md',
  className,
}: ConditionTagProps): ReactElement | null => {
  const { t } = useTranslation('shopSection');
  const labels = useProductLabels();
  const label = soldOut ? t('shop.outOfStock') : labels.condition(condition);
  if (!label) return null;

  return (
    <span
      className={clsx(
        'condition-tag',
        `condition-tag--${size}`,
        soldOut && 'condition-tag--sold-out',
        !soldOut && condition === 'PRODUCT_CONDITION_NEW' && 'condition-tag--new',
        className
      )}
    >
      {label}
    </span>
  );
};

export default ConditionTag;
