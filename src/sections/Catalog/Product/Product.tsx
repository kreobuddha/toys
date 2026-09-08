import './Product.scss';
import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

const Product = (): ReactElement => {
  const { id } = useParams();
  return (
    <section className="container product">
      <h1 className="product__title">Product {id}</h1>
    </section>
  );
};

export default Product;
