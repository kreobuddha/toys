import './Header.scss';
import type { ReactElement } from 'react';
import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import { useLinks } from '@/app/useLinks';
import { useTranslation } from 'react-i18next';
import CartDropdown from '@components/CartDropdown/CartDropdown';

const Header = (): ReactElement => {
  const { t } = useTranslation();
  const links = useLinks();

  const navItems = [
    { to: links.catalog, label: t('nav.catalog') },
    { to: links.sellToys, label: t('nav.sell') },
    { to: links.blog, label: t('nav.blog') },
    { to: links.about, label: t('nav.about') },
  ];

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to={links.home} className="header__logo">
          Toys
        </Link>
        <nav className="header__nav">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => clsx('header__link', isActive && 'header__link--active')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <CartDropdown />
      </div>
    </header>
  );
};

export default Header;
