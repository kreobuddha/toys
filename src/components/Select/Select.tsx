import './Select.scss';
import type { ReactElement, SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: SelectOption[];
  /** Shown while the value is empty; hidden from the list, so it cannot be picked back. */
  placeholder?: string;
};

const Select = ({
  label,
  options,
  placeholder,
  className,
  id,
  ...rest
}: SelectProps): ReactElement => {
  const select = (
    <select id={id} className={clsx('select__control', className)} {...rest}>
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
  if (!label) return select;
  return (
    <div className="select">
      <label className="select__label" htmlFor={id}>
        {label}
      </label>
      {select}
    </div>
  );
};

export default Select;
