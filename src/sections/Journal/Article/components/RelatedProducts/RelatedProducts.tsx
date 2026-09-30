import './RelatedProducts.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { skipToken } from '@reduxjs/toolkit/query/react';
import ProductCard from '@components/ProductCard/ProductCard';
import { useGetProductsQuery } from '@sections/Shop/api/productsApi';

interface RelatedProductsProps {
  productIds: number[];
}

/** Toys an article is about: one request, and the catalog keeps the order it was given. */
const RelatedProducts = ({ productIds }: RelatedProductsProps): ReactElement | null => {
  const { t } = useTranslation('journalSection');
  const { data } = useGetProductsQuery(
    productIds.length > 0
      ? { 'filter.productIds': productIds, perPage: productIds.length }
      : skipToken
  );

  const products = data?.products ?? [];
  if (products.length === 0) return null;

  return (
    <section className="related-products">
      <h2 className="related-products__title">{t('journal.relatedProducts')}</h2>
      <div className="related-products__grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
