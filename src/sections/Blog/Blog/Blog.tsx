import './Blog.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetArticlesQuery } from '@/api/api';
import ArticleCard from '@components/ArticleCard/ArticleCard';

const Blog = (): ReactElement => {
  const { t } = useTranslation();
  const { data: articles, isLoading, isError } = useGetArticlesQuery();

  return (
    <section className="container blog">
      <h1 className="blog__title">{t('blog.title')}</h1>
      <p className="blog__intro">{t('blog.intro')}</p>

      {isLoading && <p className="blog__state">{t('common.loading')}</p>}
      {isError && <p className="blog__state">{t('common.error')}</p>}
      {articles && articles.length === 0 && <p className="blog__state">{t('blog.empty')}</p>}

      {articles && articles.length > 0 && (
        <div className="blog__grid">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Blog;
