import './About.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

const About = (): ReactElement => {
  const { t } = useTranslation();
  const values = t('about.values', { returnObjects: true });

  return (
    <section className="container about">
      <header className="about__header">
        <h1 className="about__title">{t('about.title')}</h1>
        <p className="about__intro">{t('about.intro')}</p>
      </header>

      <div className="about__block">
        <h2 className="about__heading">{t('about.missionTitle')}</h2>
        <p className="about__text">{t('about.missionText')}</p>
      </div>

      <div className="about__block">
        <h2 className="about__heading">{t('about.valuesTitle')}</h2>
        <ul className="about__values">
          {values.map((value) => (
            <li key={value.title} className="about__value">
              <h3 className="about__value-title">{value.title}</h3>
              <p className="about__value-text">{value.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="about__block">
        <h2 className="about__heading">{t('about.teamTitle')}</h2>
        <p className="about__text about__text--placeholder">{t('about.teamText')}</p>
      </div>

      <div className="about__block">
        <h2 className="about__heading">{t('about.contactTitle')}</h2>
        <p className="about__text">{t('about.contactText')}</p>
      </div>
    </section>
  );
};

export default About;
