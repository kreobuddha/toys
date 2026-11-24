import './PlayActivities.scss';
import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useLinks } from '@/app/useLinks';

type Stage = '0-6' | '6-12' | '12-24' | '24-36' | '36-plus';

const STAGES: readonly Stage[] = ['0-6', '6-12', '12-24', '24-36', '36-plus'];

const ILLUSTRATIONS: Record<Stage, readonly string[]> = {
  '0-6': ['toy-rattle', 'toy-teether', 'toy-soft-book'],
  '6-12': ['toy-cups', 'toy-top', 'toy-drum'],
  '12-24': ['toy-pyramid', 'toy-elephant', 'toy-blocks'],
  '24-36': ['toy-shape-puzzle', 'toy-domino', 'toy-blocks'],
  '36-plus': ['toy-shape-puzzle', 'toy-domino', 'toy-drum'],
};

/** The shop URL's age aliases behind each stage; a year spans two of the catalog's ranges. */
const SHOP_AGES: Record<Stage, string> = {
  '0-6': '0-6',
  '6-12': '6-12',
  '12-24': '12-18,18-24',
  '24-36': '24-36',
  '36-plus': '36-plus',
};

const PlayActivities = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const links = useLinks();
  const [stage, setStage] = useState<Stage>('0-6');
  const ages = t('home.ages', { returnObjects: true });
  const activities = t('home.activities', { returnObjects: true })[stage];

  return (
    <section className="container play-activities">
      <div className="play-activities__card">
        <h2 className="play-activities__title">{t('home.activitiesTitle')}</h2>

        <div className="play-activities__tabs" role="tablist">
          {STAGES.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={stage === value}
              aria-controls="play-activities-panel"
              className={clsx(
                'play-activities__tab',
                stage === value && 'play-activities__tab--active'
              )}
              onClick={() => setStage(value)}
            >
              {ages[value]}
            </button>
          ))}
        </div>

        <ul id="play-activities-panel" role="tabpanel" className="play-activities__list">
          {activities.map((activity, index) => (
            <li key={activity.title} className="play-activities__item">
              <img
                src={`/home/${ILLUSTRATIONS[stage][index]}.svg`}
                alt=""
                className="play-activities__image"
              />
              <h3 className="play-activities__item-title">{activity.title}</h3>
              <p className="play-activities__item-text">{activity.text}</p>
            </li>
          ))}
        </ul>

        <Link to={`${links.shop}?age=${SHOP_AGES[stage]}`} className="play-activities__explore">
          {t('home.activitiesExplore', { age: ages[stage] })}
          <img src="/icons/arrow-right.svg" alt="" width={24} height={24} />
        </Link>
      </div>
    </section>
  );
};

export default PlayActivities;
