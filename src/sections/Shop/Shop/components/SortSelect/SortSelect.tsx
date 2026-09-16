import './SortSelect.scss';
import type { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { SORT_OPTIONS } from '@/constants/productAttributes';
import type { ProductSort } from '@/types/product';
import Select from '@components/Select/Select';

interface SortSelectProps {
  /** Sort from the URL, `null` when the URL has none. */
  value: ProductSort | null;
  /** Sort the shop applies while `value` is `null`; `null` means the backend order. */
  defaultValue: ProductSort | null;
  onChange: (value: ProductSort) => void;
}

// Explicit map so the keys stay type-checked against the translation file.
const SORT_LABELS = {
  PRODUCT_SORT_PRICE_ASCENDING: 'shop.sortPriceAsc',
  PRODUCT_SORT_PRICE_DESCENDING: 'shop.sortPriceDesc',
} as const satisfies Record<ProductSort, string>;

const isSort = (value: string): value is ProductSort => SORT_OPTIONS.includes(value as ProductSort);

/**
 * Without a default the closed select reads "Sort by price" and the list offers only the two
 * price options, so the placeholder cannot be picked back; Reset clears the sort instead.
 */
const SortSelect = ({ value, defaultValue, onChange }: SortSelectProps): ReactElement => {
  const { t } = useTranslation('shopSection');

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    if (isSort(event.target.value)) onChange(event.target.value);
  };

  return (
    <div className="sort-select">
      <Select
        id="sort"
        aria-label={t('shop.sort')}
        placeholder={defaultValue ? undefined : t('shop.sortPlaceholder')}
        options={SORT_OPTIONS.map((option) => ({ value: option, label: t(SORT_LABELS[option]) }))}
        value={value ?? defaultValue ?? ''}
        onChange={handleChange}
      />
    </div>
  );
};

export default SortSelect;
