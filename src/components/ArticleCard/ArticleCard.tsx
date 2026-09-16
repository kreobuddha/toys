import './ArticleCard.scss';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { IArticlePreview } from '@/types/article';
import { useLinks } from '@/app/useLinks';
import { formatDate, useLocale } from '@/i18n';

interface ArticleCardProps {
  article: IArticlePreview;
}

const ArticleCard = ({ article }: ArticleCardProps): ReactElement => {
  const { t } = useTranslation('journalSection');
  const locale = useLocale();
  const { article: href } = useLinks();

  return (
    <article className="article-card">
      <Link to={href(article.slug)} className="article-card__cover-link">
        {article.coverImageUrl && (
          <img src={article.coverImageUrl} alt="" loading="lazy" className="article-card__cover" />
        )}
      </Link>
      <div className="article-card__body">
        {article.publishedAt && (
          <time dateTime={article.publishedAt} className="article-card__date">
            {formatDate(article.publishedAt, locale)}
          </time>
        )}
        <h2 className="article-card__title">
          <Link to={href(article.slug)} className="article-card__title-link">
            {article.title}
          </Link>
        </h2>
        <p className="article-card__excerpt">{article.excerpt}</p>
        <Link to={href(article.slug)} className="article-card__more">
          {t('journal.readMore')} →
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
