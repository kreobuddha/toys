import './Checkbox.scss';
import type { InputHTMLAttributes, ReactElement } from 'react';
import clsx from 'clsx';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string };

const Checkbox = ({ label, className, ...rest }: CheckboxProps): ReactElement => {
  return (
    <label className={clsx('checkbox', className)}>
      <input type="checkbox" className="checkbox__input" {...rest} />
      <span className="checkbox__label">{label}</span>
    </label>
  );
};

export default Checkbox;
