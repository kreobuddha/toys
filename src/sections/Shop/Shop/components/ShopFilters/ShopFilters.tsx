import './ShopFilters.scss';
import { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useProductLabels } from '@/i18n/productLabels';
import type { IGetProductFacetsResponse, IPriceRange } from '@/types/product';
import Button from '@components/Button/Button';
import FilterGroup from '@sections/Shop/Shop/components/FilterGroup/FilterGroup';
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

/** Values with no products behind them are left out: the catalog counts them for us. */
const inStock = <T,>(facet: { productCount?: number }, option: T): T[] =>
  (facet.productCount ?? 0) > 0 ? [option] : [];

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

  const categoryOptions = (facets?.categories ?? []).flatMap((facet) =>
    inStock(facet, { value: facet.category.slug, label: facet.category.name })
  );
  const brandOptions = (facets?.brands ?? []).flatMap((facet) =>
    inStock(facet, { value: facet.brand.slug, label: facet.brand.name })
  );
  const ageOptions = (facets?.ageRanges ?? []).flatMap((facet) =>
    inStock(facet, { value: facet.ageRange, label: labels.ageOption(facet.ageRange) })
  );
  const conditionOptions = (facets?.conditions ?? []).flatMap((facet) =>
    inStock(facet, { value: facet.condition, label: labels.condition(facet.condition) })
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
        {ageOptions.length > 0 && (
          <FilterGroup
            legend={t('shop.age')}
            options={ageOptions}
            selected={params.ageRanges}
            onChange={(ageRanges) => onChange({ ageRanges })}
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
