import './ArticleBlocks.scss';
import type { ReactElement } from 'react';
import clsx from 'clsx';
import type { BlockWidth, CalloutKind, IArticleBlock, ListStyle } from '@/types/article';
import ArticleGallery from '@sections/Journal/Article/components/ArticleGallery/ArticleGallery';
import ArticleVideo from '@sections/Journal/Article/components/ArticleVideo/ArticleVideo';
import RelatedProducts from '@sections/Journal/Article/components/RelatedProducts/RelatedProducts';

interface ArticleBlocksProps {
  blocks: IArticleBlock[];
}

const WIDTH_MODIFIERS = {
  BLOCK_WIDTH_UNSPECIFIED: '',
  BLOCK_WIDTH_NORMAL: '',
  BLOCK_WIDTH_WIDE: 'article-blocks__block--wide',
  BLOCK_WIDTH_FULL_BLEED: 'article-blocks__block--full-bleed',
} as const satisfies Record<BlockWidth, string>;

const LIST_MODIFIERS = {
  LIST_STYLE_UNSPECIFIED: '',
  LIST_STYLE_BULLET: '',
  LIST_STYLE_NUMBERED: '',
  LIST_STYLE_CHECKLIST: 'article-blocks__list--checklist',
} as const satisfies Record<ListStyle, string>;

const CALLOUT_MODIFIERS = {
  CALLOUT_KIND_UNSPECIFIED: '',
  CALLOUT_KIND_TIP: 'article-blocks__callout--tip',
  CALLOUT_KIND_WARNING: 'article-blocks__callout--warning',
  CALLOUT_KIND_NOTE: 'article-blocks__callout--note',
} as const satisfies Record<CalloutKind, string>;

/** Text, list and callout bodies carry HTML the shop owners authored; the backend sanitizes it. */
const renderBlock = (block: IArticleBlock): ReactElement | null => {
  if (block.heading) {
    const Heading = block.heading.level === 3 ? 'h3' : 'h2';
    return <Heading className="article-blocks__heading">{block.heading.text}</Heading>;
  }

  if (block.text) {
    return (
      <div className="article-blocks__text" dangerouslySetInnerHTML={{ __html: block.text.html }} />
    );
  }

  if (block.image) {
    const { url, width, height, alt, caption } = block.image.image;
    return (
      <figure className="article-blocks__figure">
        <img
          src={url}
          alt={alt ?? ''}
          width={width}
          height={height}
          loading="lazy"
          className="article-blocks__image"
        />
        {caption && <figcaption className="article-blocks__caption">{caption}</figcaption>}
      </figure>
    );
  }

  if (block.gallery) {
    return <ArticleGallery images={block.gallery.images ?? []} layout={block.gallery.layout} />;
  }

  if (block.quote) {
    const { text, author, role } = block.quote;
    return (
      <blockquote className="article-blocks__quote">
        <p className="article-blocks__quote-text">{text}</p>
        {author && (
          <cite className="article-blocks__quote-author">
            {[author, role].filter(Boolean).join(', ')}
          </cite>
        )}
      </blockquote>
    );
  }

  if (block.list) {
    const style = block.list.style ?? 'LIST_STYLE_UNSPECIFIED';
    const className = clsx('article-blocks__list', LIST_MODIFIERS[style]);
    const items = (block.list.items ?? []).map((item, index) => (
      <li
        key={index}
        className="article-blocks__list-item"
        dangerouslySetInnerHTML={{ __html: item.html }}
      />
    ));
    return style === 'LIST_STYLE_NUMBERED' ? (
      <ol className={className}>{items}</ol>
    ) : (
      <ul className={className}>{items}</ul>
    );
  }

  if (block.video) return <ArticleVideo video={block.video} />;

  if (block.products) {
    return (
      <RelatedProducts productIds={block.products.productIds ?? []} title={block.products.title} />
    );
  }

  if (block.callout) {
    const { kind = 'CALLOUT_KIND_UNSPECIFIED', title, html } = block.callout;
    return (
      <aside className={clsx('article-blocks__callout', CALLOUT_MODIFIERS[kind])}>
        {title && <p className="article-blocks__callout-title">{title}</p>}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </aside>
    );
  }

  if (block.divider) return <hr className="article-blocks__divider" />;

  return null;
};

/** The article body. A block type this version does not know yet is skipped. */
const ArticleBlocks = ({ blocks }: ArticleBlocksProps): ReactElement => {
  return (
    <div className="article-blocks">
      {blocks.map((block, index) => {
        const content = renderBlock(block);
        if (!content) return null;
        return (
          <div
            key={index}
            id={block.anchor}
            className={clsx(
              'article-blocks__block',
              WIDTH_MODIFIERS[block.width ?? 'BLOCK_WIDTH_UNSPECIFIED']
            )}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default ArticleBlocks;
