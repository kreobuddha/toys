import './ShopFilters.scss';
import { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useProductLabels } from '@/i18n/productLabels';
import type { IGetProductFacetsResponse, IPriceRange } from '@/types/product';
import Button from '@components/Button/Button';
import FilterGroup, {
  type IFilterOption,
} from '@sections/Shop/Shop/components/FilterGroup/FilterGroup';
import PriceFilter from '@sections/Shop/Shop/components/PriceFilter/PriceFilter';
import type { ShopParams, UpdateOptions } from '@sections/Shop/Shop/useShopParams';

interface ShopFiltersProps {
  params: ShopParams;
  /** What the catalog offers; the panel waits for it. */
  facets?: IGetProductFacetsResponse;
  /** Catalog price bounds widened to slider steps. */
  priceBounds?: IPriceRange;
  activeCount: number;
  canReset: boolean;
  onChange: (patch: Partial<ShopParams>, options?: UpdateOptions) => void;
  onReset: () => void;
}

/**
 * A filter value as the catalog sends it: its name and order come from GetProductFacets. A value
 * with no products behind it stays listed but cannot be picked, unless it is already picked.
 */
const toOption = <T extends string>(
  value: T,
  label: string,
  productCount: number | undefined,
  selected: readonly T[]
): IFilterOption<T> => ({
  value,
  label,
  disabled: (productCount ?? 0) === 0 && !selected.includes(value),
});

const ShopFilters = ({
  params,
  facets,
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

  const categoryOptions = (facets?.categories ?? []).map((facet) =>
    toOption(facet.category.slug, facet.category.name, facet.productCount, params.categories)
  );
  const brandOptions = (facets?.brands ?? []).map((facet) =>
    toOption(facet.brand.slug, facet.brand.name, facet.productCount, params.brands)
  );
  // Age and condition are enums: the catalog names them, our labels only fill a missing name.
  const ageOptions = (facets?.ageRanges ?? []).map((facet) =>
    toOption(
      facet.ageRange,
      facet.name ?? labels.ageOption(facet.ageRange),
      facet.productCount,
      params.ageRanges
    )
  );
  const conditionOptions = (facets?.conditions ?? []).map((facet) =>
    toOption(
      facet.condition,
      facet.name ?? labels.condition(facet.condition),
      facet.productCount,
      params.conditions
    )
  );

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
        <h2 className="shop-filters__title">
          {activeCount > 0 ? t('shop.filtersCount', { count: activeCount }) : t('shop.filters')}
        </h2>
        {priceBounds && priceBounds.max > priceBounds.min && (
          <PriceFilter
            bounds={priceBounds}
            min={params.minPrice}
            max={params.maxPrice}
            onChange={handlePriceChange}
          />
        )}
        {ageOptions.length > 0 && (
          <FilterGroup
            legend={t('shop.age')}
            options={ageOptions}
            selected={params.ageRanges}
            onChange={(ageRanges) => onChange({ ageRanges })}
          />
        )}
        {categoryOptions.length > 0 && (
          <FilterGroup
            legend={t('shop.category')}
            options={categoryOptions}
            selected={params.categories}
            onChange={(categories) => onChange({ categories })}
          />
        )}
        {conditionOptions.length > 0 && (
          <FilterGroup
            legend={t('shop.condition')}
            options={conditionOptions}
            selected={params.conditions}
            onChange={(conditions) => onChange({ conditions })}
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
        {canReset && (
          <button type="button" className="shop-filters__reset" onClick={onReset}>
            <img src="/icons/reset.svg" alt="" className="shop-filters__reset-icon" />
            {t('shop.reset')}
          </button>
        )}
      </div>
    </aside>
  );
};

export default ShopFilters;
