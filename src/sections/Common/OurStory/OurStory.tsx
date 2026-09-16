import './OurStory.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

const OurStory = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const values = t('ourStory.values', { returnObjects: true });

  return (
    <section className="container our-story">
      <header className="our-story__header">
        <h1 className="our-story__title">{t('ourStory.title')}</h1>
        <p className="our-story__intro">{t('ourStory.intro')}</p>
      </header>

      <div className="our-story__block">
        <h2 className="our-story__heading">{t('ourStory.missionTitle')}</h2>
        <p className="our-story__text">{t('ourStory.missionText')}</p>
      </div>

      <div className="our-story__block">
        <h2 className="our-story__heading">{t('ourStory.valuesTitle')}</h2>
        <ul className="our-story__values">
          {values.map((value) => (
            <li key={value.title} className="our-story__value">
              <h3 className="our-story__value-title">{value.title}</h3>
              <p className="our-story__value-text">{value.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="our-story__block">
        <h2 className="our-story__heading">{t('ourStory.teamTitle')}</h2>
        <p className="our-story__text our-story__text--placeholder">{t('ourStory.teamText')}</p>
      </div>

      <div className="our-story__block">
        <h2 className="our-story__heading">{t('ourStory.contactTitle')}</h2>
        <p className="our-story__text">{t('ourStory.contactText')}</p>
      </div>
    </section>
  );
};

export default OurStory;
