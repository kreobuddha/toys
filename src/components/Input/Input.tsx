import './Input.scss';
import type { ComponentProps, ReactElement } from 'react';
import clsx from 'clsx';

// ComponentProps keeps `ref`, so react-hook-form controllers can focus the field.
type InputProps = ComponentProps<'input'> & { label?: string };

const Input = ({ label, className, id, ...rest }: InputProps): ReactElement => {
  const input = <input id={id} className={clsx('input__control', className)} {...rest} />;
  if (!label) return input;
  return (
    <label className="input" htmlFor={id}>
      <span className="input__label">{label}</span>
      {input}
    </label>
  );
};

export default Input;
