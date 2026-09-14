import './ShopFilters.scss';
import { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { AGE_GROUPS, CONDITIONS, OTHER_BRAND } from '@/api/productAttributes';
import type { IPriceRange, IProductFacets } from '@/api/types';
import { useProductLabels } from '@/i18n/productLabels';
import Button from '@components/Button/Button';
import FilterGroup from '@sections/Shop/Shop/components/FilterGroup/FilterGroup';
import PriceFilter from '@sections/Shop/Shop/components/PriceFilter/PriceFilter';
import type { ShopParams, UpdateOptions } from '@sections/Shop/Shop/useShopParams';

interface ShopFiltersProps {
  params: ShopParams;
  facets?: IProductFacets;
  /** Facet price bounds widened to slider steps; the price filter waits for them. */
  priceBounds?: IPriceRange;
  activeCount: number;
  canReset: boolean;
  onChange: (patch: Partial<ShopParams>, options?: UpdateOptions) => void;
  onReset: () => void;
}

const ShopFilters = ({
  params,
  facets,
  priceBounds,
  activeCount,
  canReset,
  onChange,
  onReset,
}: ShopFiltersProps): ReactElement => {
  const { t } = useTranslation();
  const labels = useProductLabels();
  // Below 1024px the panel folds behind the toggle; wider screens always show it.
  const [open, setOpen] = useState(false);

  const categoryOptions = (facets?.categories ?? []).map((category) => ({
    value: category.slug,
    label: category.name,
  }));
  const brandOptions = facets
    ? [
        ...facets.brands.map((brand) => ({ value: brand.slug, label: brand.name })),
        { value: OTHER_BRAND, label: t('shop.brandOther') },
      ]
    : [];
  const ageOptions = AGE_GROUPS.map((group) => ({
    value: group.id,
    label: labels.ageGroup(group.id),
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
        {categoryOptions.length > 0 && (
          <FilterGroup
            legend={t('shop.category')}
            options={categoryOptions}
            selected={params.categories}
            onChange={(categories) => onChange({ categories })}
          />
        )}
        {brandOptions.length > 0 && (
          <FilterGroup
            legend={t('shop.brand')}
            options={brandOptions}
            selected={params.brands}
            onChange={(brands) => onChange({ brands })}
          />
        )}
        <FilterGroup
          legend={t('shop.age')}
          options={ageOptions}
          selected={params.ageGroups}
          onChange={(ageGroups) => onChange({ ageGroups })}
        />
        <FilterGroup
          legend={t('shop.condition')}
          options={conditionOptions}
          selected={params.conditions}
          onChange={(conditions) => onChange({ conditions })}
        />
        {priceBounds && priceBounds.max > priceBounds.min && (
          <PriceFilter
            bounds={priceBounds}
            min={params.minPrice}
            max={params.maxPrice}
            onChange={handlePriceChange}
          />
        )}
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
