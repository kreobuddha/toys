import './ShopFilters.scss';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import type { IProductFacets } from '@/api/types';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import Select from '@components/Select/Select';
import { useTranslation } from 'react-i18next';
import type { ShopParams, UpdateOptions } from '@sections/Shop/Shop/useShopParams';

interface ShopFiltersProps {
  filters: ShopParams;
  facets?: IProductFacets;
  hasFilters: boolean;
  onChange: (patch: Partial<ShopParams>, options?: UpdateOptions) => void;
  onReset: () => void;
}

const DEBOUNCE_MS = 300;

type DebouncedField = readonly [string, (value: string) => void];

/** Local text state synced to the URL after a pause, so typing doesn't spam requests. */
const useDebouncedField = (value: string, onCommit: (v: string) => void): DebouncedField => {
  const [local, setLocal] = useState(value);
  // Adopt external changes (reset button, back navigation) without an effect.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setLocal(value);
  }

  const commitRef = useRef(onCommit);
  useEffect(() => {
    commitRef.current = onCommit;
  }, [onCommit]);

  useEffect(() => {
    if (local === value) return;
    const id = setTimeout(() => commitRef.current(local), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [local, value]);

  return [local, setLocal];
};

const toMinor = (value: string): number | undefined =>
  value ? Math.round(Number(value) * 100) : undefined;

const fromMinor = (value?: number): string => (value ? String(value / 100) : '');

const ShopFilters = ({
  filters,
  facets,
  hasFilters,
  onChange,
  onReset,
}: ShopFiltersProps): ReactElement => {
  const { t } = useTranslation();
  const [search, setSearch] = useDebouncedField(filters.search ?? '', (v) =>
    onChange({ search: v }, { replace: true })
  );
  const [minPrice, setMinPrice] = useDebouncedField(fromMinor(filters.minPrice), (v) =>
    onChange({ minPrice: toMinor(v) }, { replace: true })
  );
  const [maxPrice, setMaxPrice] = useDebouncedField(fromMinor(filters.maxPrice), (v) =>
    onChange({ maxPrice: toMinor(v) }, { replace: true })
  );

  const withAll = (values: string[] = []): { value: string; label: string }[] => [
    { value: '', label: t('shop.all') },
    ...values.map((v) => ({ value: v, label: v })),
  ];

  return (
    <aside className="shop-filters">
      <Input
        id="search"
        type="search"
        placeholder={t('shop.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        id="category"
        label={t('shop.category')}
        options={withAll(facets?.categories)}
        value={filters.category ?? ''}
        onChange={(e) => onChange({ category: e.target.value })}
      />
      <Select
        id="ageRange"
        label={t('shop.ageRange')}
        options={withAll(facets?.ageRanges)}
        value={filters.ageRange ?? ''}
        onChange={(e) => onChange({ ageRange: e.target.value })}
      />
      <div className="shop-filters__price">
        <Input
          id="minPrice"
          label={t('shop.priceFrom')}
          type="number"
          min={0}
          inputMode="decimal"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          id="maxPrice"
          label={t('shop.priceTo')}
          type="number"
          min={0}
          inputMode="decimal"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          {t('shop.reset')}
        </Button>
      )}
    </aside>
  );
};

export default ShopFilters;
