import './Product.scss';
import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetProductQuery } from '@/api/api';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import { addItem, selectCartItems } from '@/features/cart/cartSlice';
import { formatPrice, useLocale } from '@/i18n';
import Button from '@components/Button/Button';
import ProductGallery from './components/ProductGallery/ProductGallery';

const Product = (): ReactElement => {
  const { id = '' } = useParams();
  const { t } = useTranslation();
  const locale = useLocale();
  const links = useLinks();
  const dispatch = useAppDispatch();
  const { data: product, isLoading, isError, error } = useGetProductQuery(id);
  const inCart = useAppSelector(selectCartItems).some((i) => i.productId === product?.id);

  const isNotFound =
    isError && typeof error === 'object' && 'status' in error && error.status === 404;

  const handleAdd = (): void => {
    if (product) dispatch(addItem(product));
  };

  const renderState = (): ReactElement | null => {
    if (isLoading) return <p className="product__state">{t('common.loading')}</p>;
    if (isNotFound) return <p className="product__state">{t('product.notFound')}</p>;
    if (isError) return <p className="product__state">{t('common.error')}</p>;
    return null;
  };

  const facts = product
    ? [
        { label: t('product.category'), value: product.category },
        { label: t('product.ageRange'), value: product.ageRange },
        { label: t('product.condition'), value: product.condition },
      ].filter((f): f is { label: string; value: string } => Boolean(f.value))
    : [];

  return (
    <section className="container product">
      <Link to={links.catalog} className="product__back">
        ← {t('product.backToCatalog')}
      </Link>

      {renderState()}

      {product && (
        <div className="product__layout">
          <ProductGallery images={product.images} alt={product.title} />

          <div className="product__details">
            <h1 className="product__title">{product.title}</h1>
            <p className="product__price">
              {formatPrice(product.price, product.currency, locale)}
              {!product.inStock && (
                <span className="product__stock">{t('product.outOfStock')}</span>
              )}
            </p>

            <dl className="product__facts">
              {facts.map((f) => (
                <div key={f.label} className="product__fact">
                  <dt className="product__fact-label">{f.label}</dt>
                  <dd className="product__fact-value">{f.value}</dd>
                </div>
              ))}
            </dl>

            <Button
              variant={inCart ? 'secondary' : 'primary'}
              disabled={!product.inStock}
              onClick={handleAdd}
            >
              {inCart ? t('product.inCart') : t('common.addToCart')}
            </Button>

            <h2 className="product__subtitle">{t('product.description')}</h2>
            <p className="product__description">{product.description}</p>

            {product.articleSlug && (
              <Link to={links.article(product.articleSlug)} className="product__article">
                {t('product.readArticle')}
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Product;
