import './PlayActivities.scss';
import { useState, type CSSProperties, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useLinks } from '@/app/useLinks';

type Stage = '0-6' | '6-12' | '12-24' | '24-36' | '36-plus';

const STAGES: readonly Stage[] = ['0-6', '6-12', '12-24', '24-36', '36-plus'];

/** Toy illustrations from `public/toys/`, one per play type in the stage's order. */
const ILLUSTRATIONS: Record<Stage, readonly string[]> = {
  '0-6': ['soft-book', 'teether', 'rattle'],
  '6-12': ['sorter', 'cups', 'top'],
  '12-24': ['shape-puzzle', 'pyramid', 'elephant', 'drum'],
  '24-36': ['blocks', 'puzzle-piece', 'lacing', 'teapot'],
  '36-plus': ['balance-board', 'domino', 'house-and-car', 'abc-blocks'],
};

/** The shop URL's age aliases behind each stage; a year spans two of the catalog's ranges. */
const SHOP_AGES: Record<Stage, string> = {
  '0-6': '0-6',
  '6-12': '6-12',
  '12-24': '12-18,18-24',
  '24-36': '24-36',
  '36-plus': '36-plus',
};

/**
 * Play types per age. The cards only explain (hover, or a tap on touch screens, shows what the
 * play means); the one link to the shop is the stage's "Explore" below them, as the team decided.
 */
const PlayActivities = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const links = useLinks();
  const [stage, setStage] = useState<Stage>('0-6');
  const [opened, setOpened] = useState<number | null>(null);
  const ages = t('home.ages', { returnObjects: true });
  const activities = t('home.activities', { returnObjects: true })[stage];

  const chooseStage = (value: Stage): void => {
    setStage(value);
    setOpened(null);
  };

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
              onClick={() => chooseStage(value)}
            >
              {ages[value]}
            </button>
          ))}
        </div>

        <ul
          id="play-activities-panel"
          role="tabpanel"
          className="play-activities__list"
          style={{ '--columns': activities.length } as CSSProperties}
        >
          {activities.map((activity, index) => (
            <li key={activity.title}>
              {/* Both faces share one grid cell and stay laid out, so showing the explanation
                  never changes the card's size. */}
              <button
                type="button"
                className={clsx(
                  'play-activities__item',
                  opened === index && 'play-activities__item--open'
                )}
                aria-expanded={opened === index}
                onClick={() => setOpened(opened === index ? null : index)}
              >
                <span className="play-activities__face play-activities__face--rest">
                  <img
                    src={`/toys/${ILLUSTRATIONS[stage][index]}.svg`}
                    alt=""
                    className="play-activities__image"
                  />
                  <span className="play-activities__item-title">{activity.title}</span>
                </span>
                <span className="play-activities__face play-activities__face--hover">
                  <img
                    src={`/toys/hover/${ILLUSTRATIONS[stage][index]}.svg`}
                    alt=""
                    className="play-activities__image play-activities__image--hover"
                  />
                  <span
                    className="play-activities__item-title play-activities__item-title--hover"
                    aria-hidden="true"
                  >
                    {activity.title}
                  </span>
                  <span className="play-activities__item-text">{activity.text}</span>
                </span>
              </button>
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
