import { useParams } from 'react-router-dom';
import styles from './Product.module.scss';

export function Product() {
  const { id } = useParams();
  return (
    <section className="container">
      <h1 className={styles.title}>Product {id}</h1>
    </section>
  );
}
