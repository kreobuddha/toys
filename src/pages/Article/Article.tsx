import { useParams } from 'react-router-dom';
import styles from './Article.module.scss';

export function Article() {
  const { slug } = useParams();
  return (
    <section className="container">
      <h1 className={styles.title}>Article {slug}</h1>
    </section>
  );
}
