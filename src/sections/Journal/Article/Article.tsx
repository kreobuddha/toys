import './Article.scss';
import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLinks } from '@/app/useLinks';
import { formatDate, useLocale } from '@/i18n';
import { useGetArticleQuery } from '@sections/Journal/api/articlesApi';
import ArticleBlocks from './components/ArticleBlocks/ArticleBlocks';

const Article = (): ReactElement => {
  const { slug = '' } = useParams();
  const { t } = useTranslation(['journalSection', 'translation']);
  const locale = useLocale();
  const links = useLinks();
  const { data, isLoading, isError, error } = useGetArticleQuery(slug);
  const article = data?.article;

  const isNotFound =
    isError && typeof error === 'object' && 'status' in error && error.status === 404;

  const renderState = (): ReactElement | null => {
    if (isLoading) return <p className="article__state">{t('translation:common.loading')}</p>;
    if (isNotFound) return <p className="article__state">{t('journal.notFound')}</p>;
    if (isError) return <p className="article__state">{t('translation:common.error')}</p>;
    return null;
  };

  return (
    <section className="container article">
      <Link to={links.journal} className="article__back">
        ← {t('journal.back')}
      </Link>

      {renderState()}

      {article && (
        <article className="article__body">
          <header className="article__header">
            {article.publishedAt && (
              <time dateTime={article.publishedAt} className="article__date">
                {formatDate(article.publishedAt, locale)}
              </time>
            )}
            <h1 className="article__title">{article.title}</h1>
            <p className="article__excerpt">{article.excerpt}</p>
          </header>
          {article.coverImageUrl && (
            <img src={article.coverImageUrl} alt="" className="article__cover" />
          )}
          <ArticleBlocks blocks={article.blocks ?? []} />
          <footer className="article__footer">
            <Link to={links.shop} className="article__shop">
              {t('journal.relatedToys')} →
            </Link>
          </footer>
        </article>
      )}
    </section>
  );
};

export default Article;
