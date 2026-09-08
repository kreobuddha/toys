import './Faq.scss';
import type { ReactElement } from 'react';

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqProps {
  items: readonly FaqItem[];
}

const Faq = ({ items }: FaqProps): ReactElement => {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q} className="faq__item">
          <summary className="faq__question">{item.q}</summary>
          <p className="faq__answer">{item.a}</p>
        </details>
      ))}
    </div>
  );
};

export default Faq;
