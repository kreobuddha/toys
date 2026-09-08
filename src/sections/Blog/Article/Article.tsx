import './Article.scss';
import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

const Article = (): ReactElement => {
  const { slug } = useParams();
  return (
    <section className="container article">
      <h1 className="article__title">Article {slug}</h1>
    </section>
  );
};

export default Article;
