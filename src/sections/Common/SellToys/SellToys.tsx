import './SellToys.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import Faq from '@components/Faq/Faq';
import SellForm from './components/SellForm/SellForm';

const SellToys = (): ReactElement => {
  const { t } = useTranslation();
  const steps = t('sell.how', { returnObjects: true });
  const faq = t('sell.faq', { returnObjects: true });

  return (
    <section className="container sell-toys">
      <header className="sell-toys__header">
        <h1 className="sell-toys__title">{t('sell.title')}</h1>
        <p className="sell-toys__intro">{t('sell.intro')}</p>
      </header>

      <div className="sell-toys__block">
        <h2 className="sell-toys__heading">{t('sell.howTitle')}</h2>
        <ol className="sell-toys__steps">
          {steps.map((step, index) => (
            <li key={step.title} className="sell-toys__step">
              <span className="sell-toys__step-number">{index + 1}</span>
              <h3 className="sell-toys__step-title">{step.title}</h3>
              <p className="sell-toys__step-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="sell-toys__block">
        <h2 className="sell-toys__heading">{t('sell.acceptTitle')}</h2>
        <p className="sell-toys__text">{t('sell.acceptText')}</p>
      </div>

      <div className="sell-toys__block sell-toys__block--narrow">
        <h2 className="sell-toys__heading">{t('sell.faqTitle')}</h2>
        <Faq items={faq} />
      </div>

      <div className="sell-toys__block sell-toys__block--narrow" id="sell-form">
        <h2 className="sell-toys__heading">{t('sell.formTitle')}</h2>
        <SellForm />
      </div>
    </section>
  );
};

export default SellToys;
