import './RelatedArticles.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import ArticleCard from '@components/ArticleCard/ArticleCard';
import { useGetArticleQuery, useGetArticlesQuery } from '@sections/Journal/api/articlesApi';

const COUNT = 3;

interface RelatedArticlesProps {
  /** The article the catalog links to this toy; it goes first. */
  articleSlug?: string;
}

/** Journal articles under a product: its own article first, then the latest ones. */
const RelatedArticles = ({ articleSlug }: RelatedArticlesProps): ReactElement | null => {
  const { t } = useTranslation('shopSection');
  const { data: related } = useGetArticleQuery(articleSlug ?? '', { skip: !articleSlug });
  const { data: latest } = useGetArticlesQuery({ pageSize: COUNT + 1 });

  const articles = [related?.article, ...(latest?.articlePreviews ?? [])]
    .filter((article) => article !== undefined)
    .filter((article, index, all) => all.findIndex((other) => other.id === article.id) === index)
    .slice(0, COUNT);

  if (articles.length === 0) return null;

  return (
    <section className="container related-articles">
      <h2 className="related-articles__title">{t('product.relatedArticles')}</h2>
      <div className="related-articles__grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
