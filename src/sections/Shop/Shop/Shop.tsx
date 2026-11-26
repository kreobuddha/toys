import './Shop.scss';
import { useMemo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { getRuntimeConfig } from '@/app/runtimeConfig';
import { toPriceBounds } from '@/constants/productAttributes';
import Button from '@components/Button/Button';
import Pagination from '@components/Pagination/Pagination';
import ProductCard from '@components/ProductCard/ProductCard';
import { useGetProductFacetsQuery, useGetProductsQuery } from '@sections/Shop/api/productsApi';
import LaunchSignup from './components/LaunchSignup/LaunchSignup';
import ShopFilters from './components/ShopFilters/ShopFilters';
import SortSelect from './components/SortSelect/SortSelect';
import { DEFAULT_SORT, PER_PAGE, useShopParams } from './useShopParams';

/** The catalog with its filters, as it runs once the shop is open. */
const Catalog = (): ReactElement => {
  const { t } = useTranslation(['shopSection', 'translation']);
  const { data: facets } = useGetProductFacetsQuery();
  const priceBounds = useMemo(
    () => (facets ? toPriceBounds(facets.minPriceEuroCents, facets.maxPriceEuroCents) : undefined),
    [facets]
  );
  const { params, requestParams, update, reset, activeCount } = useShopParams(priceBounds);
  const { data, isLoading, isFetching, isError } = useGetProductsQuery(requestParams);

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.ceil(total / PER_PAGE);

  const handlePageChange = (page: number): void => {
    update({ page });
    window.scrollTo({ top: 0 });
  };

  const isEmpty = Boolean(data) && products.length === 0;

  return (
    <section className="container shop">
      <div className="shop__heading">
        <h1 className="shop__title">{t('shop.title')}</h1>
        <div className="shop__toolbar">
          <span className="shop__count">{data ? t('shop.results', { count: total }) : ' '}</span>
          <SortSelect
            value={params.sort}
            defaultValue={DEFAULT_SORT}
            onChange={(sort) => update({ sort })}
          />
        </div>
      </div>
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
          {isError && <p className="shop__state">{t('translation:common.error')}</p>}
          {isLoading && <p className="shop__state">{t('translation:common.loading')}</p>}

          {isEmpty && (
            <div className="shop__empty">
              <img src="/toys/color/puzzle-piece.svg" alt="" className="shop__empty-image" />
              <h2 className="shop__empty-title">{t('shop.emptyTitle')}</h2>
              <p className="shop__empty-text">{t('shop.emptyText')}</p>
              {activeCount > 0 && <Button onClick={reset}>{t('shop.emptyAction')}</Button>}
            </div>
          )}

          {products.length > 0 && (
            <div className="shop__grid" aria-busy={isFetching}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination page={params.page} pageCount={pageCount} onChange={handlePageChange} />
        </div>
      </div>
    </section>
  );
};

/** Before the launch the shop page announces the opening date instead of the catalog. */
const Launch = (): ReactElement => {
  const { t } = useTranslation('shopSection');
  return (
    <section className="container shop">
      <div className="shop__heading">
        <h1 className="shop__title">{t('shop.title')}</h1>
      </div>
      <LaunchSignup />
    </section>
  );
};

const Shop = (): ReactElement => (getRuntimeConfig().prelaunch ? <Launch /> : <Catalog />);

export default Shop;
