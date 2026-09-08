import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import { routes } from '@/app/routes';
import { useAppSelector } from '@/app/hooks';
import { selectCartCount } from '@/features/cart/cartSlice';
import { useT } from '@/i18n';
import styles from './Header.module.scss';

export function Header() {
  const t = useT();
  const count = useAppSelector(selectCartCount);

  const links = [
    { to: routes.catalog, label: t.nav.catalog },
    { to: routes.sellToys, label: t.nav.sell },
    { to: routes.blog, label: t.nav.blog },
    { to: routes.about, label: t.nav.about },
  ];

  return (
    <header className={styles.root}>
      <div className={clsx('container', styles.inner)}>
        <Link to={routes.home} className={styles.logo}>
          Toys
        </Link>
        <nav className={styles.nav}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to={routes.cart} className={styles.cart}>
          {t.nav.cart}
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </Link>
      </div>
    </header>
  );
}
