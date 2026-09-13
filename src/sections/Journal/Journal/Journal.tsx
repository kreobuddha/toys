import './Journal.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetArticlesQuery } from '@/api/api';
import ArticleCard from '@components/ArticleCard/ArticleCard';

const Journal = (): ReactElement => {
  const { t } = useTranslation();
  const { data: articles, isLoading, isError } = useGetArticlesQuery();

  return (
    <section className="container journal">
      <h1 className="journal__title">{t('journal.title')}</h1>
      <p className="journal__intro">{t('journal.intro')}</p>

      {isLoading && <p className="journal__state">{t('common.loading')}</p>}
      {isError && <p className="journal__state">{t('common.error')}</p>}
      {articles && articles.length === 0 && <p className="journal__state">{t('journal.empty')}</p>}

      {articles && articles.length > 0 && (
        <div className="journal__grid">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Journal;
