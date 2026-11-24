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
import ConditionTag from '@components/ConditionTag/ConditionTag';
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
  const meta = [product.categories?.[0]?.name, labels.ageSpan(product.ageRanges)].filter(Boolean);

  return (
    <article className="product-card">
      <Link to={href} className="product-card__image-link" tabIndex={-1} aria-hidden>
        <img src={product.imageUrls?.[0]} alt="" loading="lazy" className="product-card__image" />
        <ConditionTag
          condition={product.condition}
          soldOut={!inStock}
          className="product-card__tag"
        />
      </Link>
      {meta.length > 0 && <p className="product-card__meta">{meta.join(' · ')}</p>}
      <h3 className="product-card__title">
        <Link to={href} className="product-card__title-link">
          {product.title}
        </Link>
      </h3>
      <div className="product-card__footer">
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
          <button
            type="button"
            className="product-card__add"
            aria-label={t('translation:common.addToCart')}
            disabled={!inStock}
            onClick={() => dispatch(addItem(product))}
          >
            <span className="product-card__add-icon" aria-hidden />
            <span className="product-card__add-label" aria-hidden>
              {t('shop.addShort')}
            </span>
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
