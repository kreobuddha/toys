import '@components/Input/Input.scss';
import type { ComponentProps, ReactElement } from 'react';
import clsx from 'clsx';

// ComponentProps keeps `ref`, so react-hook-form's register works on it.
type TextareaProps = ComponentProps<'textarea'> & { label?: string };

/** A multi-line field in the same frame as Input, as the design's delivery notes. */
const Textarea = ({ label, className, id, ...rest }: TextareaProps): ReactElement => {
  const control = (
    <textarea
      id={id}
      className={clsx('input__control', 'input__control--multiline', className)}
      {...rest}
    />
  );
  if (!label) return control;
  return (
    <div className="input">
      <label className="input__label" htmlFor={id}>
        {label}
      </label>
      {control}
    </div>
  );
};

export default Textarea;
