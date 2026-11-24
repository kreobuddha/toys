import './CartDropdown.scss';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getRuntimeConfig } from '@/app/runtimeConfig';
import { useLinks } from '@/app/useLinks';
import {
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  setQuantity,
} from '@/features/cart/cartSlice';
import { CURRENCY } from '@/constants/productAttributes';
import { formatPrice, useLocale } from '@/i18n';
import ButtonLink from '@components/ButtonLink/ButtonLink';
import QuantityStepper from '@components/QuantityStepper/QuantityStepper';

/** Header cart: a toggle with a badge and a dropdown panel listing the items. */
const CartDropdown = (): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const links = useLinks();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);

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
        // Nothing can be bought before the launch.
        disabled={getRuntimeConfig().prelaunch}
        onClick={handleToggle}
      >
        <img src="/icons/cart.svg" alt="" width={32} height={32} className="cart-dropdown__icon" />
        {count > 0 && <span className="cart-dropdown__badge">{count}</span>}
      </button>

      <div
        className={clsx('cart-dropdown__panel', open && 'cart-dropdown__panel--open')}
        role="dialog"
        aria-labelledby="cart-dropdown-title"
        hidden={!open}
      >
        <div className="cart-dropdown__header">
          <h2 id="cart-dropdown-title" className="cart-dropdown__title">
            {t('cart.title')}
          </h2>
          <button
            type="button"
            className="cart-dropdown__round cart-dropdown__close"
            aria-label={t('cart.close')}
            onClick={handleClose}
          >
            <img src="/icons/close.svg" alt="" />
          </button>
        </div>
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
                    {item.slug ? (
                      <Link
                        to={links.product(item.slug)}
                        className="cart-dropdown__name"
                        onClick={handleClose}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <span className="cart-dropdown__name">{item.title}</span>
                    )}
                    <span className="cart-dropdown__price">
                      {formatPrice(item.price, CURRENCY, locale)}
                    </span>
                  </div>
                  <div className="cart-dropdown__controls">
                    <button
                      type="button"
                      className="cart-dropdown__round cart-dropdown__remove"
                      aria-label={t('cart.remove')}
                      onClick={() => dispatch(removeItem(item.productId))}
                    >
                      <img src="/icons/trash.svg" alt="" />
                    </button>
                    <QuantityStepper
                      value={item.quantity}
                      size="sm"
                      onChange={(quantity) =>
                        dispatch(setQuantity({ productId: item.productId, quantity }))
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-dropdown__footer">
              <p className="cart-dropdown__total">
                {t('cart.total')}
                <strong className="cart-dropdown__total-value">
                  {formatPrice(total, CURRENCY, locale)}
                </strong>
              </p>
              <ButtonLink
                to={links.checkout}
                className="cart-dropdown__checkout"
                onClick={handleClose}
              >
                {t('cart.checkout')}
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;
