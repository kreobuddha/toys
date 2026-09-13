import './SortSelect.scss';
import type { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { isSortOption, SORT_OPTIONS } from '@/api/productAttributes';
import type { SortOption } from '@/api/types';
import Select from '@components/Select/Select';

interface SortSelectProps {
  /** Sort from the URL, `null` when the URL has none. */
  value: SortOption | null;
  /** Sort the shop applies while `value` is `null`; `null` means the backend order. */
  defaultValue: SortOption | null;
  onChange: (value: SortOption) => void;
}

// Explicit map so the keys stay type-checked against the translation file.
const SORT_LABELS = {
  price_asc: 'shop.sortPriceAsc',
  price_desc: 'shop.sortPriceDesc',
} as const satisfies Record<SortOption, string>;

/**
 * Without a default the closed select reads "Sort by price" and the list offers only the two
 * price options, so the placeholder cannot be picked back; Reset clears the sort instead.
 */
const SortSelect = ({ value, defaultValue, onChange }: SortSelectProps): ReactElement => {
  const { t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    if (isSortOption(event.target.value)) onChange(event.target.value);
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
