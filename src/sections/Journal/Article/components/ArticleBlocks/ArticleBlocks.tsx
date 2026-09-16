import './ArticleBlocks.scss';
import type { ReactElement } from 'react';
import type { IArticleBlock } from '@/types/article';

interface ArticleBlocksProps {
  blocks: IArticleBlock[];
}

/**
 * Renders the CMS block list. `text` blocks carry HTML authored by the shop
 * owners in their admin, so it is trusted content, not user input.
 */
const ArticleBlocks = ({ blocks }: ArticleBlocksProps): ReactElement => {
  return (
    <div className="article-blocks">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'text':
            return block.html ? (
              <div
                key={index}
                className="article-blocks__text"
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            ) : null;
          case 'image':
            return block.src ? (
              <figure key={index} className="article-blocks__figure">
                <img
                  src={block.src}
                  alt={block.alt ?? ''}
                  loading="lazy"
                  className="article-blocks__image"
                />
                {block.caption && (
                  <figcaption className="article-blocks__caption">{block.caption}</figcaption>
                )}
              </figure>
            ) : null;
          case 'quote':
            return block.text ? (
              <blockquote key={index} className="article-blocks__quote">
                <p className="article-blocks__quote-text">{block.text}</p>
                {block.author && (
                  <cite className="article-blocks__quote-author">{block.author}</cite>
                )}
              </blockquote>
            ) : null;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ArticleBlocks;
