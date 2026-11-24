import './Input.scss';
import { useId, type ComponentProps, type ReactElement } from 'react';
import clsx from 'clsx';

// ComponentProps keeps `ref`, so react-hook-form controllers can focus the field.
type InputProps = ComponentProps<'input'> & {
  label?: string;
  /** Shown under the field; it also marks the field invalid. */
  error?: string;
};

const Input = ({ label, error, className, id, ...rest }: InputProps): ReactElement => {
  const errorId = useId();
  const input = (
    <input
      id={id}
      className={clsx('input__control', error && 'input__control--invalid', className)}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      {...rest}
    />
  );
  if (!label && !error) return input;
  return (
    <div className={clsx('input', error && 'input--invalid')}>
      {label && (
        <label className="input__label" htmlFor={id}>
          {label}
        </label>
      )}
      {input}
      {error && (
        <span id={errorId} className="input__error">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
