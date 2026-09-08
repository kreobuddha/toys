import './Textarea.scss';
import type { ReactElement, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };

const Textarea = ({ label, className, id, ...rest }: TextareaProps): ReactElement => {
  const control = <textarea id={id} className={clsx('textarea__control', className)} {...rest} />;
  if (!label) return control;
  return (
    <label className="textarea" htmlFor={id}>
      <span className="textarea__label">{label}</span>
      {control}
    </label>
  );
};

export default Textarea;
