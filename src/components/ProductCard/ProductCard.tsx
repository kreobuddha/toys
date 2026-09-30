import './ProductCard.scss';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import { CURRENCY } from '@/constants/productAttributes';
import { addItem, selectCartItems, setQuantity } from '@/features/cart/cartSlice';
import { formatPrice, useLocale } from '@/i18n';
import { useProductLabels } from '@/i18n/productLabels';
import type { IProduct } from '@/types/product';
import Button from '@components/Button/Button';
import QuantityStepper from '@components/QuantityStepper/QuantityStepper';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps): ReactElement => {
  const { t } = useTranslation(['shopSection', 'translation']);
  const locale = useLocale();
  const links = useLinks();
  const labels = useProductLabels();
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(selectCartItems).find((item) => item.productId === product.id);

  const href = links.product(product.slug);
  const inStock = (product.availableQuantity ?? 0) > 0;
  const meta = [product.categories?.[0]?.name, labels.ageSpan(product.ageRanges)]
    .filter(Boolean)
    .join(' · ');

  return (
    <article className="product-card">
      <Link to={href} className="product-card__image-link">
        <img
          src={product.imageUrls?.[0]}
          alt={product.title}
          loading="lazy"
          className="product-card__image"
        />
        {!inStock && <span className="product-card__badge">{t('shop.outOfStock')}</span>}
      </Link>
      <div className="product-card__body">
        <div className="product-card__meta">{meta}</div>
        <h3 className="product-card__title">
          <Link to={href} className="product-card__title-link">
            {product.title}
          </Link>
        </h3>
        <div className="product-card__bottom">
          <span className="product-card__price">
            {formatPrice(product.priceEuroCents ?? 0, CURRENCY, locale)}
          </span>
          {cartItem ? (
            <QuantityStepper
              value={cartItem.quantity}
              max={product.availableQuantity}
              size="sm"
              onChange={(quantity) => dispatch(setQuantity({ productId: product.id, quantity }))}
            />
          ) : (
            <Button size="sm" disabled={!inStock} onClick={() => dispatch(addItem(product))}>
              {t('translation:common.addToCart')}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
