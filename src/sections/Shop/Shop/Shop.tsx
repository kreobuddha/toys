import './Shop.scss';
import { useMemo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { toPriceBounds } from '@/constants/productAttributes';
import Pagination from '@components/Pagination/Pagination';
import ProductCard from '@components/ProductCard/ProductCard';
import { useGetProductFacetsQuery, useGetProductsQuery } from '@sections/Shop/api/productsApi';
import ShopFilters from './components/ShopFilters/ShopFilters';
import SortSelect from './components/SortSelect/SortSelect';
import { DEFAULT_SORT, PER_PAGE, useShopParams } from './useShopParams';

const Shop = (): ReactElement => {
  const { t } = useTranslation(['shopSection', 'translation']);
  const { data: facets } = useGetProductFacetsQuery();
  const priceBounds = useMemo(
    () => (facets ? toPriceBounds(facets.minPrice, facets.maxPrice) : undefined),
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
            <span className="shop__count">{data ? t('shop.results', { count: total }) : ' '}</span>
            <SortSelect
              value={params.sort}
              defaultValue={DEFAULT_SORT}
              onChange={(sort) => update({ sort })}
            />
          </div>

          {isError && <p className="shop__state">{t('translation:common.error')}</p>}
          {isLoading && <p className="shop__state">{t('translation:common.loading')}</p>}
          {data && products.length === 0 && <p className="shop__state">{t('shop.empty')}</p>}

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

export default Shop;
