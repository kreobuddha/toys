import './Reviews.scss';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

/**
 * Reviews in a row that scrolls a page at a time: three cards on a wide screen, one on a phone.
 * The browser lays the pages out with scroll snapping; the arrows and dots only steer it.
 */
const Reviews = (): ReactElement => {
  const { t } = useTranslation('commonSection');
  const reviews = t('home.reviews', { returnObjects: true });
  const trackRef = useRef<HTMLUListElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = (): void => {
      const width = track.clientWidth;
      // Not laid out yet: dividing by zero would ask for an endless row of dots.
      if (width === 0) return;
      setPages(Math.max(1, Math.round(track.scrollWidth / width)));
      setPage(Math.round(track.scrollLeft / width));
    };
    measure();
    track.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      track.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const goTo = (index: number): void => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className="container reviews">
      <h2 className="reviews__title">{t('home.reviewsTitle')}</h2>
      <p className="reviews__lead">{t('home.reviewsLead')}</p>

      <div className="reviews__carousel">
        <button
          type="button"
          className="reviews__arrow reviews__arrow--left"
          aria-label={t('home.reviewsPrevious')}
          disabled={page === 0}
          onClick={() => goTo(page - 1)}
        >
          <img src="/icons/chevron-left.svg" alt="" width={80} height={80} />
        </button>
        <ul ref={trackRef} className="reviews__track">
          {reviews.map((review) => (
            <li key={review.author} className="reviews__item">
              <p className="reviews__text">{review.text}</p>
              <p className="reviews__author">{review.author}</p>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="reviews__arrow reviews__arrow--right"
          aria-label={t('home.reviewsNext')}
          disabled={page >= pages - 1}
          onClick={() => goTo(page + 1)}
        >
          <img src="/icons/chevron-right.svg" alt="" width={80} height={80} />
        </button>
      </div>

      {pages > 1 && (
        <div className="reviews__dots">
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              className={clsx('reviews__dot', index === page && 'reviews__dot--active')}
              aria-label={t('home.reviewsPage', { index: index + 1 })}
              aria-current={index === page}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Reviews;
