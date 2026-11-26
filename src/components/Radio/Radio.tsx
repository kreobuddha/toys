import './Radio.scss';
import type { ComponentProps, ReactElement } from 'react';
import clsx from 'clsx';

// ComponentProps keeps `ref`, so react-hook-form's register works on it.
type RadioProps = Omit<ComponentProps<'input'>, 'type'>;

/** The design's radio button; the option card around it is the caller's. */
const Radio = ({ className, ...rest }: RadioProps): ReactElement => {
  return <input type="radio" className={clsx('radio', className)} {...rest} />;
};

export default Radio;
