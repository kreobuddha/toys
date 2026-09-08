import { Link } from 'react-router-dom';
import { routes } from '@/app/routes';
import { useT } from '@/i18n';
import styles from './NotFound.module.scss';

export function NotFound() {
  const t = useT();
  return (
    <section className="container">
      <h1 className={styles.title}>{t.common.notFound}</h1>
      <Link to={routes.home}>{t.nav.home}</Link>
    </section>
  );
}
