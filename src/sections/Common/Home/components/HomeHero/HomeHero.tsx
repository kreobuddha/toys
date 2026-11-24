import './HomeHero.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useLinks } from '@/app/useLinks';
import ButtonLink from '@components/ButtonLink/ButtonLink';

const HomeHero = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const links = useLinks();

  return (
    <section className="home-hero">
      <img src="/home/hero-shape.svg" alt="" className="home-hero__shape" />
      <img src="/home/hero-photo.png" alt="" className="home-hero__photo" />
      <div className="container home-hero__inner">
        <div className="home-hero__text">
          <p className="home-hero__eyebrow">{t('home.heroEyebrow')}</p>
          <h1 className="home-hero__title">{t('home.heroTitle')}</h1>
          <p className="home-hero__lead">{t('home.heroText')}</p>
        </div>
        <div className="home-hero__actions">
          <ButtonLink to={links.shop}>{t('home.heroShop')}</ButtonLink>
          <ButtonLink to={links.sellToUs}>{t('home.heroSell')}</ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
