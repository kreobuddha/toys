import './Shop.scss';
import { useMemo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetProductFacetsQuery, useGetProductsQuery } from '@/api/api';
import { toPriceBounds } from '@/api/productAttributes';
import Pagination from '@components/Pagination/Pagination';
import ProductCard from '@components/ProductCard/ProductCard';
import ShopFilters from './components/ShopFilters/ShopFilters';
import SortSelect from './components/SortSelect/SortSelect';
import { DEFAULT_SORT, PER_PAGE, useShopParams } from './useShopParams';

const Shop = (): ReactElement => {
  const { t } = useTranslation();
  const { data: facets } = useGetProductFacetsQuery();
  const priceBounds = useMemo(() => facets && toPriceBounds(facets.price), [facets]);
  const { params, query, update, reset, activeCount } = useShopParams(priceBounds);
  const { data, isLoading, isFetching, isError } = useGetProductsQuery(query);

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
          params={params}
          facets={facets}
          priceBounds={priceBounds}
          activeCount={activeCount}
          canReset={activeCount > 0 || params.sort !== null}
          onChange={update}
          onReset={reset}
        />
        <div className="shop__content">
          <div className="shop__toolbar">
            <span className="shop__count">
              {data ? t('shop.results', { count: data.total }) : ' '}
            </span>
            <SortSelect
              value={params.sort}
              defaultValue={DEFAULT_SORT}
              onChange={(sort) => update({ sort })}
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

          <Pagination page={params.page} pageCount={pageCount} onChange={handlePageChange} />
        </div>
      </div>
    </section>
  );
};

export default Shop;
