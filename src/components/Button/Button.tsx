import './Button.scss';
import type { ButtonHTMLAttributes, ReactElement } from 'react';
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'sm';
  /** Busy with a request: shows a spinner and blocks clicks, keeping the button's colours. */
  loading?: boolean;
};

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps): ReactElement => {
  return (
    <button
      type="button"
      className={clsx('button', `button--${variant}`, size === 'sm' && 'button--sm', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="button__spinner" aria-hidden />}
      {children}
    </button>
  );
};

export default Button;
