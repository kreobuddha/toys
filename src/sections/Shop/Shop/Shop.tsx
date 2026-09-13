import './Shop.scss';
import type { ReactElement } from 'react';
import type { SortOption } from '@/api/types';
import { useGetProductFacetsQuery, useGetProductsQuery } from '@/api/api';
import Pagination from '@components/Pagination/Pagination';
import ProductCard from '@components/ProductCard/ProductCard';
import Select from '@components/Select/Select';
import { useTranslation } from 'react-i18next';
import ShopFilters from './components/ShopFilters/ShopFilters';
import { PER_PAGE, useShopParams } from './useShopParams';

const Shop = (): ReactElement => {
  const { t } = useTranslation();
  const { filters, query, update, reset, hasFilters } = useShopParams();
  const { data, isLoading, isFetching, isError } = useGetProductsQuery(query);
  const { data: facets } = useGetProductFacetsQuery();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('shop.sortNewest') },
    { value: 'price_asc', label: t('shop.sortPriceAsc') },
    { value: 'price_desc', label: t('shop.sortPriceDesc') },
  ];
  const pageCount = data ? Math.ceil(data.total / PER_PAGE) : 0;

  const handlePageChange = (page: number): void => {
    update({ page });
    window.scrollTo({ top: 0 });
  };

  return (
    <section className="container shop">
      <h1 className="shop__title">{t('shop.title')}</h1>
      <div className="shop__layout">
        <ShopFilters
          filters={filters}
          facets={facets}
          hasFilters={hasFilters}
          onChange={update}
          onReset={reset}
        />
        <div className="shop__content">
          <div className="shop__toolbar">
            <span className="shop__count">
              {data ? t('shop.results', { count: data.total }) : ' '}
            </span>
            <Select
              id="sort"
              className="shop__sort"
              aria-label={t('shop.sort')}
              options={sortOptions}
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortOption })}
            />
          </div>

          {isError && <p className="shop__state">{t('common.error')}</p>}
          {isLoading && <p className="shop__state">{t('common.loading')}</p>}
          {data && data.items.length === 0 && <p className="shop__state">{t('shop.empty')}</p>}

          {data && data.items.length > 0 && (
            <div className="shop__grid" aria-busy={isFetching}>
              {data.items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <Pagination page={filters.page ?? 1} pageCount={pageCount} onChange={handlePageChange} />
        </div>
      </div>
    </section>
  );
};

export default Shop;
