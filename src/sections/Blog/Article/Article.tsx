import './Article.scss';
import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetArticleQuery } from '@/api/api';
import { useLinks } from '@/app/useLinks';
import { formatDate, useLocale } from '@/i18n';
import ArticleBlocks from './components/ArticleBlocks/ArticleBlocks';

const Article = (): ReactElement => {
  const { slug = '' } = useParams();
  const { t } = useTranslation();
  const locale = useLocale();
  const links = useLinks();
  const { data: article, isLoading, isError, error } = useGetArticleQuery(slug);

  const isNotFound =
    isError && typeof error === 'object' && 'status' in error && error.status === 404;

  const renderState = (): ReactElement | null => {
    if (isLoading) return <p className="article__state">{t('common.loading')}</p>;
    if (isNotFound) return <p className="article__state">{t('blog.notFound')}</p>;
    if (isError) return <p className="article__state">{t('common.error')}</p>;
    return null;
  };

  return (
    <section className="container article">
      <Link to={links.blog} className="article__back">
        ← {t('blog.back')}
      </Link>

      {renderState()}

      {article && (
        <article className="article__body">
          <header className="article__header">
            <time dateTime={article.publishedAt} className="article__date">
              {formatDate(article.publishedAt, locale)}
            </time>
            <h1 className="article__title">{article.title}</h1>
            <p className="article__excerpt">{article.excerpt}</p>
          </header>
          {article.cover && <img src={article.cover} alt="" className="article__cover" />}
          <ArticleBlocks blocks={article.blocks} />
          <footer className="article__footer">
            <Link to={links.catalog} className="article__catalog">
              {t('blog.relatedToys')} →
            </Link>
          </footer>
        </article>
      )}
    </section>
  );
};

export default Article;
