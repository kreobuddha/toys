import './CartDropdown.scss';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useLinks } from '@/app/useLinks';
import {
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  setQuantity,
} from '@/features/cart/cartSlice';
import { formatPrice, useLocale } from '@/i18n';
import Button from '@components/Button/Button';

/** Header cart: a toggle with a badge and a dropdown panel listing the items. */
const CartDropdown = (): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const links = useLinks();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);
  const currency = items[0]?.currency ?? 'EUR';

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleToggle = (): void => setOpen((v) => !v);
  const handleClose = (): void => setOpen(false);

  return (
    <div className="cart-dropdown" ref={rootRef}>
      <button
        type="button"
        className="cart-dropdown__toggle"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t('cart.open')}
        onClick={handleToggle}
      >
        {t('cart.title')}
        {count > 0 && <span className="cart-dropdown__badge">{count}</span>}
      </button>

      <div
        className={clsx('cart-dropdown__panel', open && 'cart-dropdown__panel--open')}
        role="dialog"
        aria-label={t('cart.title')}
        hidden={!open}
      >
        {items.length === 0 ? (
          <p className="cart-dropdown__empty">{t('cart.empty')}</p>
        ) : (
          <>
            <ul className="cart-dropdown__list">
              {items.map((item) => (
                <li key={item.productId} className="cart-dropdown__item">
                  {item.image && (
                    <img src={item.image} alt="" className="cart-dropdown__thumb" loading="lazy" />
                  )}
                  <div className="cart-dropdown__info">
                    <Link
                      to={links.product(item.productId)}
                      className="cart-dropdown__name"
                      onClick={handleClose}
                    >
                      {item.title}
                    </Link>
                    <span className="cart-dropdown__price">
                      {formatPrice(item.price * item.quantity, item.currency, locale)}
                    </span>
                  </div>
                  <div className="cart-dropdown__qty" aria-label={t('cart.quantity')}>
                    <button
                      type="button"
                      className="cart-dropdown__qty-button"
                      aria-label="−"
                      onClick={() =>
                        dispatch(
                          setQuantity({ productId: item.productId, quantity: item.quantity - 1 })
                        )
                      }
                    >
                      −
                    </button>
                    <span className="cart-dropdown__qty-value">{item.quantity}</span>
                    <button
                      type="button"
                      className="cart-dropdown__qty-button"
                      aria-label="+"
                      onClick={() =>
                        dispatch(
                          setQuantity({ productId: item.productId, quantity: item.quantity + 1 })
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="cart-dropdown__remove"
                    aria-label={t('cart.remove')}
                    onClick={() => dispatch(removeItem(item.productId))}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-dropdown__footer">
              <span className="cart-dropdown__total">
                {t('cart.total')}: <strong>{formatPrice(total, currency, locale)}</strong>
              </span>
              <Link to={links.checkout} onClick={handleClose}>
                <Button size="sm">{t('cart.checkout')}</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;
