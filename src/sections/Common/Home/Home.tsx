import './Home.scss';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetProductsQuery } from '@/api/api';
import { useLinks } from '@/app/useLinks';
import Button from '@components/Button/Button';
import Faq from '@components/Faq/Faq';
import ProductCard from '@components/ProductCard/ProductCard';

const FEATURED_COUNT = 4;

const Home = (): ReactElement => {
  const { t } = useTranslation();
  const links = useLinks();
  const { data: featured } = useGetProductsQuery({ sort: 'newest', perPage: FEATURED_COUNT });

  const steps = t('home.how', { returnObjects: true });
  const faq = t('home.faq', { returnObjects: true });
  const reviews = t('home.reviews', { returnObjects: true });

  return (
    <div className="home">
      <section className="home__hero">
        <div className="container home__hero-inner">
          <h1 className="home__title">{t('home.heroTitle')}</h1>
          <p className="home__lead">{t('home.heroText')}</p>
          <div className="home__actions">
            <Link to={links.catalog}>
              <Button>{t('home.heroCatalog')}</Button>
            </Link>
            <Link to={links.sellToys}>
              <Button variant="secondary">{t('home.heroSell')}</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container home__section">
        <h2 className="home__heading">{t('home.howTitle')}</h2>
        <ol className="home__steps">
          {steps.map((step, index) => (
            <li key={step.title} className="home__step">
              <span className="home__step-number">{index + 1}</span>
              <h3 className="home__step-title">{step.title}</h3>
              <p className="home__step-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {featured && featured.items.length > 0 && (
        <section className="container home__section">
          <div className="home__section-head">
            <h2 className="home__heading">{t('home.featuredTitle')}</h2>
            <Link to={links.catalog} className="home__link">
              {t('home.featuredAll')} →
            </Link>
          </div>
          <div className="home__featured">
            {featured.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="container home__section home__section--narrow">
        <h2 className="home__heading">{t('home.faqTitle')}</h2>
        <Faq items={faq} />
      </section>

      <section className="container home__section">
        <h2 className="home__heading">{t('home.reviewsTitle')}</h2>
        <ul className="home__reviews">
          {reviews.map((review) => (
            <li key={review.author} className="home__review">
              <p className="home__review-text">“{review.text}”</p>
              <span className="home__review-author">{review.author}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Home;
