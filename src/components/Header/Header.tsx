import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import { useLinks } from '@/app/useLinks';
import { useAppSelector } from '@/app/hooks';
import { selectCartCount } from '@/features/cart/cartSlice';
import { useT } from '@/i18n';
import styles from './Header.module.scss';

export function Header() {
  const t = useT();
  const links = useLinks();
  const count = useAppSelector(selectCartCount);

  const navItems = [
    { to: links.catalog, label: t.nav.catalog },
    { to: links.sellToys, label: t.nav.sell },
    { to: links.blog, label: t.nav.blog },
    { to: links.about, label: t.nav.about },
  ];

  return (
    <header className={styles.root}>
      <div className={clsx('container', styles.inner)}>
        <Link to={links.home} className={styles.logo}>
          Toys
        </Link>
        <nav className={styles.nav}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to={links.cart} className={styles.cart}>
          {t.nav.cart}
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </Link>
      </div>
    </header>
  );
}
