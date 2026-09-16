import './SellToUs.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import Faq from '@components/Faq/Faq';
import SellForm from './components/SellForm/SellForm';

const SellToUs = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const steps = t('sellToUs.how', { returnObjects: true });
  const faq = t('sellToUs.faq', { returnObjects: true });

  return (
    <section className="container sell-to-us">
      <header className="sell-to-us__header">
        <h1 className="sell-to-us__title">{t('sellToUs.title')}</h1>
        <p className="sell-to-us__intro">{t('sellToUs.intro')}</p>
      </header>

      <div className="sell-to-us__block">
        <h2 className="sell-to-us__heading">{t('sellToUs.howTitle')}</h2>
        <ol className="sell-to-us__steps">
          {steps.map((step, index) => (
            <li key={step.title} className="sell-to-us__step">
              <span className="sell-to-us__step-number">{index + 1}</span>
              <h3 className="sell-to-us__step-title">{step.title}</h3>
              <p className="sell-to-us__step-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="sell-to-us__block">
        <h2 className="sell-to-us__heading">{t('sellToUs.acceptTitle')}</h2>
        <p className="sell-to-us__text">{t('sellToUs.acceptText')}</p>
      </div>

      <div className="sell-to-us__block sell-to-us__block--narrow">
        <h2 className="sell-to-us__heading">{t('sellToUs.faqTitle')}</h2>
        <Faq items={faq} />
      </div>

      <div className="sell-to-us__block sell-to-us__block--narrow" id="sell-form">
        <h2 className="sell-to-us__heading">{t('sellToUs.formTitle')}</h2>
        <SellForm />
      </div>
    </section>
  );
};

export default SellToUs;
