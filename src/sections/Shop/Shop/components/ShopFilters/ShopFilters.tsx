import './ShopFilters.scss';
import { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { AGE_RANGES, CATEGORIES, CONDITIONS } from '@/constants/productAttributes';
import { useProductLabels } from '@/i18n/productLabels';
import type { IPriceRange } from '@/types/product';
import Button from '@components/Button/Button';
import FilterGroup from '@sections/Shop/Shop/components/FilterGroup/FilterGroup';
import PriceFilter from '@sections/Shop/Shop/components/PriceFilter/PriceFilter';
import type { ShopParams, UpdateOptions } from '@sections/Shop/Shop/useShopParams';

interface ShopFiltersProps {
  params: ShopParams;
  /** Price bounds widened to slider steps. */
  priceBounds: IPriceRange;
  activeCount: number;
  canReset: boolean;
  onChange: (patch: Partial<ShopParams>, options?: UpdateOptions) => void;
  onReset: () => void;
}

const ShopFilters = ({
  params,
  priceBounds,
  activeCount,
  canReset,
  onChange,
  onReset,
}: ShopFiltersProps): ReactElement => {
  const { t } = useTranslation('shopSection');
  const labels = useProductLabels();
  // Below 1024px the panel folds behind the toggle; wider screens always show it.
  const [open, setOpen] = useState(false);

  const categoryOptions = CATEGORIES.map((category) => ({
    value: category,
    label: labels.category(category),
  }));
  const ageOptions = AGE_RANGES.map((range) => ({
    value: range,
    label: labels.ageOption(range),
  }));
  const conditionOptions = CONDITIONS.map((condition) => ({
    value: condition,
    label: labels.condition(condition),
  }));

  const handlePriceChange = (minPrice?: number, maxPrice?: number): void => {
    onChange({ minPrice, maxPrice }, { replace: true });
  };

  return (
    <aside className="shop-filters">
      <div className="shop-filters__bar">
        <Button
          variant="secondary"
          aria-expanded={open}
          aria-controls="shop-filters-panel"
          onClick={() => setOpen((value) => !value)}
        >
          {activeCount > 0 ? t('shop.filtersCount', { count: activeCount }) : t('shop.filters')}
        </Button>
      </div>
      <div
        id="shop-filters-panel"
        className={clsx('shop-filters__panel', open && 'shop-filters__panel--open')}
      >
        <FilterGroup
          legend={t('shop.category')}
          options={categoryOptions}
          selected={params.categories}
          onChange={(categories) => onChange({ categories })}
        />
        <FilterGroup
          legend={t('shop.age')}
          options={ageOptions}
          selected={params.ageRange ? [params.ageRange] : []}
          single
          onChange={([ageRange]) => onChange({ ageRange: ageRange ?? null })}
        />
        <FilterGroup
          legend={t('shop.condition')}
          options={conditionOptions}
          selected={params.condition ? [params.condition] : []}
          single
          onChange={([condition]) => onChange({ condition: condition ?? null })}
        />
        <PriceFilter
          bounds={priceBounds}
          min={params.minPrice}
          max={params.maxPrice}
          onChange={handlePriceChange}
        />
        {canReset && (
          <Button variant="ghost" size="sm" className="shop-filters__reset" onClick={onReset}>
            {t('shop.reset')}
          </Button>
        )}
      </div>
    </aside>
  );
};

export default ShopFilters;
