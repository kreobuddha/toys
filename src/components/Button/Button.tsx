import './Button.scss';
import type { ButtonHTMLAttributes, ReactElement } from 'react';
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'sm';
};

const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonProps): ReactElement => {
  return (
    <button
      type="button"
      className={clsx('button', `button--${variant}`, size === 'sm' && 'button--sm', className)}
      {...rest}
    />
  );
};

export default Button;
