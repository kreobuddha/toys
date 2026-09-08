import './Catalog.scss';
import type { ReactElement } from 'react';
import type { SortOption } from '@/api/types';
import { useGetCatalogFacetsQuery, useGetProductsQuery } from '@/api/api';
import Pagination from '@components/Pagination/Pagination';
import ProductCard from '@components/ProductCard/ProductCard';
import Select from '@components/Select/Select';
import { useTranslation } from 'react-i18next';
import CatalogFilters from './components/CatalogFilters/CatalogFilters';
import { PER_PAGE, useCatalogParams } from './useCatalogParams';

const Catalog = (): ReactElement => {
  const { t } = useTranslation();
  const { filters, query, update, reset, hasFilters } = useCatalogParams();
  const { data, isLoading, isFetching, isError } = useGetProductsQuery(query);
  const { data: facets } = useGetCatalogFacetsQuery();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('catalog.sortNewest') },
    { value: 'price_asc', label: t('catalog.sortPriceAsc') },
    { value: 'price_desc', label: t('catalog.sortPriceDesc') },
  ];
  const pageCount = data ? Math.ceil(data.total / PER_PAGE) : 0;

  const handlePageChange = (page: number): void => {
    update({ page });
    window.scrollTo({ top: 0 });
  };

  return (
    <section className="container catalog">
      <h1 className="catalog__title">{t('catalog.title')}</h1>
      <div className="catalog__layout">
        <CatalogFilters
          filters={filters}
          facets={facets}
          hasFilters={hasFilters}
          onChange={update}
          onReset={reset}
        />
        <div className="catalog__content">
          <div className="catalog__toolbar">
            <span className="catalog__count">
              {data ? t('catalog.results', { count: data.total }) : ' '}
            </span>
            <Select
              id="sort"
              className="catalog__sort"
              aria-label={t('catalog.sort')}
              options={sortOptions}
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortOption })}
            />
          </div>

          {isError && <p className="catalog__state">{t('common.error')}</p>}
          {isLoading && <p className="catalog__state">{t('common.loading')}</p>}
          {data && data.items.length === 0 && (
            <p className="catalog__state">{t('catalog.empty')}</p>
          )}

          {data && data.items.length > 0 && (
            <div className="catalog__grid" aria-busy={isFetching}>
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

export default Catalog;
