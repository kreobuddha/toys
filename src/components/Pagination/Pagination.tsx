import './Pagination.scss';
import type { ReactElement } from 'react';
import clsx from 'clsx';
import Button from '@components/Button/Button';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

type PageItem = number | '…';

/** Page numbers with ellipses: 1 … 4 5 6 … 12 */
const pageItems = (page: number, pageCount: number): PageItem[] => {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  const out: PageItem[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
};

const Pagination = ({ page, pageCount, onChange }: PaginationProps): ReactElement | null => {
  const { t } = useTranslation();
  if (pageCount <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        {t('pagination.prev')}
      </Button>
      <ul className="pagination__list">
        {pageItems(page, pageCount).map((item, i) => (
          <li key={`${item}-${i}`}>
            {item === '…' ? (
              <span className="pagination__gap">…</span>
            ) : (
              <button
                type="button"
                className={clsx('pagination__page', item === page && 'pagination__page--current')}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            )}
          </li>
        ))}
      </ul>
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        {t('pagination.next')}
      </Button>
    </nav>
  );
};

export default Pagination;
