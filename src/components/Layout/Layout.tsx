import './Layout.scss';
import { Suspense, type ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import { useTranslation } from 'react-i18next';

const Layout = (): ReactElement => {
  const { t } = useTranslation();
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <Suspense fallback={<p className="layout__loading">{t('common.loading')}</p>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
