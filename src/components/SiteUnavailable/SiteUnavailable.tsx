import './SiteUnavailable.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@components/Button/Button';

/** Shown instead of the whole site when the backend cannot be reached. */
const SiteUnavailable = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <main className="container site-unavailable">
      <div className="site-unavailable__card">
        <span className="site-unavailable__tape" aria-hidden />
        <div className="site-unavailable__message">
          <p className="site-unavailable__eyebrow">{t('unavailable.eyebrow')}</p>
          <h1 className="site-unavailable__title">{t('unavailable.title')}</h1>
          <p className="site-unavailable__text">{t('unavailable.text')}</p>
          <div className="site-unavailable__retry">
            {/* A fresh load retries every request and the runtime config in one go. */}
            <Button onClick={() => window.location.reload()}>{t('unavailable.retry')}</Button>
            <p className="site-unavailable__hint">{t('unavailable.hint')}</p>
          </div>
        </div>
        <img
          src="/illustrations/girl-balloon.svg"
          alt=""
          width={480}
          height={480}
          className="site-unavailable__image"
        />
      </div>
    </main>
  );
};

export default SiteUnavailable;
