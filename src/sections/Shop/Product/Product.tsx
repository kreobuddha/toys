import './Product.scss';
import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import { CURRENCY, OTHERS_BRAND_SLUG } from '@/constants/productAttributes';
import { addItem, selectCartItems, setQuantity } from '@/features/cart/cartSlice';
import { formatPrice, useLocale } from '@/i18n';
import { useProductLabels } from '@/i18n/productLabels';
import { errorReasonOf, httpStatusOf } from '@/utils/apiError';
import Button from '@components/Button/Button';
import QuantityStepper from '@components/QuantityStepper/QuantityStepper';
import { useGetProductQuery } from '@sections/Shop/api/productsApi';
import ProductGallery from './components/ProductGallery/ProductGallery';
import RelatedArticles from './components/RelatedArticles/RelatedArticles';

interface IFact {
  label: string;
  value: string;
}

const Product = (): ReactElement => {
  const { slug = '' } = useParams();
  const { t } = useTranslation(['shopSection', 'translation']);
  const locale = useLocale();
  const links = useLinks();
  const labels = useProductLabels();
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, error } = useGetProductQuery(slug);
  const product = data?.product;
  const cartItem = useAppSelector(selectCartItems).find((item) => item.productId === product?.id);
  const inStock = (product?.availableQuantity ?? 0) > 0;

  const isNotFound = errorReasonOf(error)?.endsWith('_NOT_FOUND') || httpStatusOf(error) === 404;

  const handleAdd = (): void => {
    if (product) dispatch(addItem(product));
  };

  const handleQuantity = (quantity: number): void => {
    if (product) dispatch(setQuantity({ productId: product.id, quantity }));
  };

  const renderState = (): ReactElement | null => {
    if (isLoading) return <p className="product__state">{t('translation:common.loading')}</p>;
    if (isNotFound) return <p className="product__state">{t('product.notFound')}</p>;
    if (isError) return <p className="product__state">{t('translation:common.error')}</p>;
    return null;
  };

  const onlyFilled = (facts: IFact[]): IFact[] => facts.filter((fact) => fact.value);

  const summary = product
    ? onlyFilled([
        {
          label: t('product.age'),
          value: (product.ageRanges ?? [])
            .filter((range) => range !== 'PRODUCT_AGE_RANGE_UNSPECIFIED')
            .map(labels.ageOption)
            .join('; '),
        },
        {
          label: t('product.category'),
          value: (product.categories ?? []).map((category) => category.name).join('; '),
        },
      ])
    : [];

  const details = product
    ? onlyFilled([
        {
          label: t('product.brand'),
          // "Others" is the catalog's placeholder for a toy without a public brand.
          value: product.brand?.slug === OTHERS_BRAND_SLUG ? '' : (product.brand?.name ?? ''),
        },
        { label: t('product.condition'), value: labels.condition(product.condition) },
      ])
    : [];

  const renderFacts = (facts: IFact[]): ReactElement => (
    <ul className="product__facts">
      {facts.map((fact) => (
        <li key={fact.label} className="product__fact">
          <span className="product__fact-label">{fact.label}:</span> {fact.value}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="product">
      <section className="container product__main">
        <Link to={links.shop} className="product__back">
          <img src="/icons/arrow-left.svg" alt="" className="product__back-icon" />
          {t('product.backToShop')}
        </Link>

        {renderState()}

        {product && (
          <div className="product__layout">
            <ProductGallery
              key={product.id}
              images={product.imageUrls ?? []}
              alt={product.title}
              condition={product.condition}
              soldOut={!inStock}
            />

            <div className="product__info">
              <div className="product__purchase">
                <div className="product__heading">
                  <h1 className="product__title">{product.title}</h1>
                  <p className="product__price">
                    {formatPrice(product.priceEuroCents ?? 0, CURRENCY, locale)}
                  </p>
                  {summary.length > 0 && renderFacts(summary)}
                </div>

                <div className="product__actions">
                  {cartItem ? (
                    <QuantityStepper
                      value={cartItem.quantity}
                      max={product.availableQuantity}
                      onChange={handleQuantity}
                      className="product__quantity"
                    />
                  ) : (
                    <Button disabled={!inStock} onClick={handleAdd}>
                      {inStock ? t('product.addToCart') : t('product.outOfStock')}
                    </Button>
                  )}
                  <div className="product__buyback">
                    <p className="product__buyback-text">{t('product.buyback')}</p>
                    <Link to={links.sellToUs} className="product__buyback-link">
                      {t('product.buybackLink')}
                      <img src="/icons/arrow-up-right.svg" alt="" width={24} height={24} />
                    </Link>
                  </div>
                </div>
              </div>

              {product.description && (
                <section className="product__section">
                  <h2 className="product__section-title">{t('product.description')}</h2>
                  <p className="product__description">{product.description}</p>
                </section>
              )}

              {details.length > 0 && (
                <details className="product__section product__details" open>
                  <summary className="product__section-title product__summary">
                    {t('product.details')}
                    <img src="/icons/chevron-down.svg" alt="" className="product__chevron" />
                  </summary>
                  {renderFacts(details)}
                </details>
              )}
            </div>
          </div>
        )}
      </section>

      {product && <RelatedArticles articleSlug={product.relatedArticleSlug} />}
    </div>
  );
};

export default Product;
