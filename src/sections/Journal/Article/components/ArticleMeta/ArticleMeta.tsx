import './ArticleMeta.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, useLocale } from '@/i18n';
import type { IArticle } from '@/types/article';

interface ArticleMetaProps {
  article: IArticle;
}

/** Author, reading time, tags and the date of the last revision. */
const ArticleMeta = ({ article }: ArticleMetaProps): ReactElement | null => {
  const { t } = useTranslation('journalSection');
  const locale = useLocale();
  const { author, readingMinutes, tags = [], updatedAt } = article;

  if (!author && !readingMinutes && tags.length === 0 && !updatedAt) return null;

  return (
    <div className="article-meta">
      {author && (
        <span className="article-meta__author">
          {author.photo && (
            <img
              src={author.photo.url}
              alt=""
              width={author.photo.width}
              height={author.photo.height}
              className="article-meta__photo"
            />
          )}
          {[author.name, author.role].filter(Boolean).join(', ')}
        </span>
      )}
      {readingMinutes !== undefined && readingMinutes > 0 && (
        <span className="article-meta__reading">
          {t('journal.readingMinutes', { count: readingMinutes })}
        </span>
      )}
      {updatedAt && (
        <span className="article-meta__updated">
          {t('journal.updated', { date: formatDate(updatedAt, locale) })}
        </span>
      )}
      {tags.length > 0 && (
        <ul className="article-meta__tags">
          {tags.map((tag) => (
            <li key={tag} className="article-meta__tag">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArticleMeta;
