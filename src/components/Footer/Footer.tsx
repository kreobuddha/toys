import { useT } from '@/i18n';
import styles from './Footer.module.scss';

export function Footer() {
  const t = useT();
  return (
    <footer className={styles.root}>
      <div className="container">
        © {new Date().getFullYear()} Toys. {t.footer.rights}
      </div>
    </footer>
  );
}
