import './Journal.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import ArticleCard from '@components/ArticleCard/ArticleCard';
import { useGetArticlesQuery } from '@sections/Journal/api/articlesApi';

/** The journal has no pagination in the UI; one generous page covers the whole archive. */
const PAGE_SIZE = 100;

const Journal = (): ReactElement => {
  const { t } = useTranslation(['journalSection', 'translation']);
  const { data, isLoading, isError } = useGetArticlesQuery({ pageSize: PAGE_SIZE });
  const articles = data?.articlePreviews ?? [];

  return (
    <section className="container journal">
      <h1 className="journal__title">{t('journal.title')}</h1>
      <p className="journal__intro">{t('journal.intro')}</p>

      {isLoading && <p className="journal__state">{t('translation:common.loading')}</p>}
      {isError && <p className="journal__state">{t('translation:common.error')}</p>}
      {data && articles.length === 0 && <p className="journal__state">{t('journal.empty')}</p>}

      {articles.length > 0 && (
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
