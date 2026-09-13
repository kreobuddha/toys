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
    { to: links.shop, label: t('nav.shop') },
    { to: links.sellToUs, label: t('nav.sellToUs') },
    { to: links.ourStory, label: t('nav.ourStory') },
    { to: links.journal, label: t('nav.journal') },
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
