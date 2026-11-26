import './HowItWorks.scss';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLinks } from '@/app/useLinks';
import ButtonLink from '@components/ButtonLink/ButtonLink';

/** The loop of the shop: good toys in, checked, chosen, outgrown and passed on again. */
const HowItWorks = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const links = useLinks();
  const steps = t('home.how', { returnObjects: true });

  // The first two steps explain, the last two act.
  const targets = [links.ourStory, links.ourStory, links.shop, links.sellToUs];

  return (
    <section className="container how-it-works">
      <h2 className="how-it-works__title">{t('home.howTitle')}</h2>
      <div className="how-it-works__steps">
        <img src="/illustrations/steps-loop.svg" alt="" className="how-it-works__loop" />
        <img src="/illustrations/steps-line.svg" alt="" className="how-it-works__line" />
        <ol className="how-it-works__list">
          {steps.map((step, index) => (
            <li key={step.title} className="how-it-works__step">
              <span className="how-it-works__number">{index + 1}</span>
              <h3 className="how-it-works__step-title">{step.title}</h3>
              <p className="how-it-works__step-text">{step.text}</p>
              {index < 2 ? (
                <Link to={targets[index]} className="how-it-works__link">
                  {step.link}
                  <img src="/icons/arrow-right.svg" alt="" width={24} height={24} />
                </Link>
              ) : (
                <ButtonLink to={targets[index]} className="how-it-works__action">
                  {step.link}
                </ButtonLink>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
