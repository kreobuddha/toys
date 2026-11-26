import './Layout.scss';
import { Suspense, type ReactElement } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import { selectApiUnavailable } from '@/features/apiStatus/apiStatusSlice';
import SiteUnavailable from '@components/SiteUnavailable/SiteUnavailable';
import BackgroundShapes from '@components/BackgroundShapes/BackgroundShapes';
import type { IRouteHandle } from '@/app/routes';

const Layout = (): ReactElement => {
  const { t } = useTranslation();
  const unavailable = useAppSelector(selectApiUnavailable);
  const backgroundSeed = useMatches()
    .map((match) => (match.handle as IRouteHandle | undefined)?.backgroundSeed)
    .findLast((seed) => seed !== undefined);
  if (unavailable) return <SiteUnavailable />;

  return (
    <div className="layout">
      <Header />
      {/* The page and the footer share one background, so the toys fall on under the footer. */}
      <div className="layout__body">
        {backgroundSeed !== undefined && <BackgroundShapes seed={backgroundSeed} />}
        <main className="layout__main">
          <Suspense fallback={<p className="layout__loading">{t('common.loading')}</p>}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
