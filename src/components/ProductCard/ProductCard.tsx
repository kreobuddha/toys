import './ProductCard.scss';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import { CURRENCY } from '@/constants/productAttributes';
import { addItem, selectCartItems } from '@/features/cart/cartSlice';
import { formatPrice, useLocale } from '@/i18n';
import { useProductLabels } from '@/i18n/productLabels';
import type { IProduct } from '@/types/product';
import Button from '@components/Button/Button';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps): ReactElement => {
  const { t } = useTranslation(['shopSection', 'translation']);
  const locale = useLocale();
  const links = useLinks();
  const labels = useProductLabels();
  const dispatch = useAppDispatch();
  const inCart = useAppSelector(selectCartItems).some((item) => item.productId === product.id);

  const href = links.product(product.id);
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
            {formatPrice(product.price ?? 0, CURRENCY, locale)}
          </span>
          <Button
            variant={inCart ? 'secondary' : 'primary'}
            size="sm"
            disabled={!inStock}
            onClick={() => dispatch(addItem(product))}
          >
            {inCart ? t('shop.inCart') : t('translation:common.addToCart')}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
