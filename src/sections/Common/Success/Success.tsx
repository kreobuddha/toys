import './Success.scss';
import type { ReactElement } from 'react';

const Success = (): ReactElement => {
  return (
    <section className="container success">
      <h1 className="success__title">Thank you for your order!</h1>
    </section>
  );
};

export default Success;
