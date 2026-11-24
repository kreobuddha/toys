import './CartNotice.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { CartProblem } from '@sections/Order/Checkout/cartProblems';

interface CartNoticeProps {
  /** One entry per toy the catalog changed. */
  problems: CartProblem[];
}

/** The banner over the checkout when the cart needs fixing before payment. */
const CartNotice = ({ problems }: CartNoticeProps): ReactElement | null => {
  const { t } = useTranslation('orderSection');
  if (problems.length === 0) return null;
  const kind = problems.length === 1 ? problems[0] : 'several';

  return (
    <div className="cart-notice" role="alert">
      <p className="cart-notice__title">{t(`checkout.notice.${kind}.title`)}</p>
      <p className="cart-notice__text">{t(`checkout.notice.${kind}.text`)}</p>
    </div>
  );
};

export default CartNotice;
