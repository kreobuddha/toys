import './TrustStrip.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

const TrustStrip = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const points = t('home.trust', { returnObjects: true });

  return (
    <section className="trust-strip">
      <ul className="container trust-strip__list">
        {points.map((point) => (
          <li key={point} className="trust-strip__item">
            <img src="/icons/badge-check.svg" alt="" width={52} height={52} />
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrustStrip;
