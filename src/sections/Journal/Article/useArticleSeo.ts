import { useEffect } from 'react';
import type { IArticle } from '@/types/article';

const DEFAULT_TITLE = 'Toys';

const setMeta = (attribute: string, name: string, content?: string): void => {
  const selector = `meta[${attribute}="${name}"]`;
  const existing = document.head.querySelector(selector);
  if (!content) {
    existing?.remove();
    return;
  }
  const meta = existing ?? document.head.appendChild(document.createElement('meta'));
  meta.setAttribute(attribute, name);
  meta.setAttribute('content', content);
};

/**
 * Article metadata in the document head. The shop is a single-page app, so the tags are set on
 * render and cleaned up when the reader leaves the article.
 */
export const useArticleSeo = (article?: IArticle): void => {
  useEffect(() => {
    if (!article) return;

    const title = article.seo?.title ?? article.title;
    const description = article.seo?.description ?? article.excerpt;
    document.title = `${title} — ${DEFAULT_TITLE}`;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', article.seo?.ogImageUrl ?? article.cover?.url);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('name', 'description');
      setMeta('property', 'og:title');
      setMeta('property', 'og:description');
      setMeta('property', 'og:image');
    };
  }, [article]);
};
