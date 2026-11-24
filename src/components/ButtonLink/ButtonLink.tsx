import '@components/Button/Button.scss';
import type { ReactElement } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import clsx from 'clsx';

type ButtonLinkProps = LinkProps & {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'sm';
};

/** A link that looks like a button, for calls to action that navigate. */
const ButtonLink = ({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonLinkProps): ReactElement => {
  return (
    <Link
      className={clsx('button', `button--${variant}`, size === 'sm' && 'button--sm', className)}
      {...rest}
    />
  );
};

export default ButtonLink;
