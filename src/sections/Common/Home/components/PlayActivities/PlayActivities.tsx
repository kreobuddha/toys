import './PlayActivities.scss';
import { useState, type CSSProperties, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useLinks } from '@/app/useLinks';
import { useGetProductFacetsQuery } from '@sections/Shop/api/productsApi';

/** Age stages; each is also the shop URL's alias for that age range. */
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

/**
 * The shop category behind each play type, by its name in the design's filter list. Names, not
 * slugs: the catalog owns the slugs, and one it lacks leaves the card filtering by age alone.
 */
const CATEGORIES: Record<Stage, readonly string[]> = {
  '0-6': ['Sensory exploration', 'Reaching & grasping', 'Sound & music'],
  '6-12': ['Put in & take out', 'Stacking & building', 'Push, pull & rolling toys'],
  '12-24': [
    'Puzzles, sorting & matching',
    'Stacking & building',
    'Push, pull & rolling toys',
    'Sound & music',
  ],
  '24-36': [
    'Stacking & building',
    'Puzzles, sorting & matching',
    'Threading & lacing',
    'Stories & pretend play',
  ],
  '36-plus': [
    'Balance & coordination',
    'First games',
    'Stories & pretend play',
    'Letters & numbers',
  ],
};

const normalize = (name: string): string => name.trim().toLowerCase();

/**
 * Play types per age. Hovering a card shows what the play means; the card opens the shop on the
 * stage's age and, when the catalog has it, the matching category.
 */
const PlayActivities = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const links = useLinks();
  const [stage, setStage] = useState<Stage>('0-6');
  const ages = t('home.ages', { returnObjects: true });
  const activities = t('home.activities', { returnObjects: true })[stage];

  const { data: facets } = useGetProductFacetsQuery();
  const slugByName = new Map(
    (facets?.categories ?? []).map(({ category }) => [normalize(category.name), category.slug])
  );

  const shopUrl = (index: number): string => {
    const slug = slugByName.get(normalize(CATEGORIES[stage][index] ?? ''));
    const category = slug ? `category=${encodeURIComponent(slug)}&` : '';
    return `${links.shop}?${category}age=${stage}`;
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
              onClick={() => setStage(value)}
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
              <Link to={shopUrl(index)} className="play-activities__item">
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
              </Link>
            </li>
          ))}
        </ul>

        <Link to={`${links.shop}?age=${stage}`} className="play-activities__explore">
          {t('home.activitiesExplore', { age: ages[stage] })}
          <img src="/icons/arrow-right.svg" alt="" width={24} height={24} />
        </Link>
      </div>
    </section>
  );
};

export default PlayActivities;
