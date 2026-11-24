import './Header.scss';
import { useEffect, useState, type ReactElement } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useLinks } from '@/app/useLinks';
import { useTranslation } from 'react-i18next';
import CartDropdown from '@components/CartDropdown/CartDropdown';

const Header = (): ReactElement => {
  const { t } = useTranslation();
  const links = useLinks();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  // Going to another page closes the phone menu; adjusted during render, not in an effect.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const navItems = [
    { to: links.shop, label: t('nav.shop') },
    { to: links.sellToUs, label: t('nav.sellToUs') },
    { to: links.ourStory, label: t('nav.ourStory') },
    { to: links.journal, label: t('nav.journal') },
  ];

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to={links.home} className="header__logo" aria-label={t('brand.home')}>
          <img src="/brand/logo-k.svg" alt="" width={46} height={40} />
        </Link>
        {/* A row on wide screens; on phones a panel under the header, opened by the burger. */}
        <nav id="header-nav" className={clsx('header__nav', menuOpen && 'header__nav--open')}>
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
        <button
          type="button"
          className="header__burger"
          aria-expanded={menuOpen}
          aria-controls="header-nav"
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <img
            src={menuOpen ? '/icons/close-brown.svg' : '/icons/menu.svg'}
            alt=""
            width={32}
            height={32}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
