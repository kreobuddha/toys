import { Link } from 'react-router-dom';
import { useLinks } from '@/app/useLinks';
import { useT } from '@/i18n';
import styles from './NotFound.module.scss';

export function NotFound() {
  const t = useT();
  const links = useLinks();
  return (
    <section className="container">
      <h1 className={styles.title}>{t.common.notFound}</h1>
      <Link to={links.home}>{t.nav.home}</Link>
    </section>
  );
}
