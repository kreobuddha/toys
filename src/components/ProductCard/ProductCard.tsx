import './ProductCard.scss';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import type { IProduct } from '@/api/types';
import { useLinks } from '@/app/useLinks';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addItem, selectCartItems } from '@/features/cart/cartSlice';
import Button from '@components/Button/Button';
import { useTranslation } from 'react-i18next';
import { formatPrice, useLocale } from '@/i18n';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const links = useLinks();
  const dispatch = useAppDispatch();
  const inCart = useAppSelector(selectCartItems).some((i) => i.productId === product.id);
  const href = links.product(product.id);

  const handleAdd = (): void => {
    dispatch(addItem(product));
  };

  return (
    <article className="product-card">
      <Link to={href} className="product-card__image-link">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="product-card__image"
        />
        {!product.inStock && <span className="product-card__badge">{t('catalog.outOfStock')}</span>}
      </Link>
      <div className="product-card__body">
        <div className="product-card__meta">
          {product.category}
          {product.ageRange && ` · ${product.ageRange}`}
        </div>
        <h3 className="product-card__title">
          <Link to={href} className="product-card__title-link">
            {product.title}
          </Link>
        </h3>
        <div className="product-card__bottom">
          <span className="product-card__price">
            {formatPrice(product.price, product.currency, locale)}
          </span>
          <Button
            size="sm"
            variant={inCart ? 'secondary' : 'primary'}
            disabled={!product.inStock}
            onClick={handleAdd}
          >
            {inCart ? t('catalog.inCart') : t('common.addToCart')}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
