import './CatalogFilters.scss';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import type { ICatalogFacets } from '@/api/types';
import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import Select from '@components/Select/Select';
import { useTranslation } from 'react-i18next';
import type { CatalogFilters as Filters, UpdateOptions } from '../../useCatalogParams';

interface CatalogFiltersProps {
  filters: Filters;
  facets?: ICatalogFacets;
  hasFilters: boolean;
  onChange: (patch: Partial<Filters>, options?: UpdateOptions) => void;
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

const CatalogFilters = ({
  filters,
  facets,
  hasFilters,
  onChange,
  onReset,
}: CatalogFiltersProps): ReactElement => {
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
    { value: '', label: t('catalog.all') },
    ...values.map((v) => ({ value: v, label: v })),
  ];

  return (
    <aside className="catalog-filters">
      <Input
        id="search"
        type="search"
        placeholder={t('catalog.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        id="category"
        label={t('catalog.category')}
        options={withAll(facets?.categories)}
        value={filters.category ?? ''}
        onChange={(e) => onChange({ category: e.target.value })}
      />
      <Select
        id="ageRange"
        label={t('catalog.ageRange')}
        options={withAll(facets?.ageRanges)}
        value={filters.ageRange ?? ''}
        onChange={(e) => onChange({ ageRange: e.target.value })}
      />
      <div className="catalog-filters__price">
        <Input
          id="minPrice"
          label={t('catalog.priceFrom')}
          type="number"
          min={0}
          inputMode="decimal"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          id="maxPrice"
          label={t('catalog.priceTo')}
          type="number"
          min={0}
          inputMode="decimal"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          {t('catalog.reset')}
        </Button>
      )}
    </aside>
  );
};

export default CatalogFilters;
