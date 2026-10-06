import './ArticleGallery.scss';
import type { ReactElement } from 'react';
import clsx from 'clsx';
import type { GalleryLayout, IArticleImage } from '@/types/article';

interface ArticleGalleryProps {
  images: IArticleImage[];
  layout?: GalleryLayout;
}

const LAYOUT_MODIFIERS = {
  GALLERY_LAYOUT_UNSPECIFIED: '',
  GALLERY_LAYOUT_GRID: '',
  GALLERY_LAYOUT_CAROUSEL: 'article-gallery__list--carousel',
  GALLERY_LAYOUT_BEFORE_AFTER: 'article-gallery__list--before-after',
} as const satisfies Record<GalleryLayout, string>;

/** A gallery block: a grid, a swipeable row, or two images side by side. */
const ArticleGallery = ({ images, layout }: ArticleGalleryProps): ReactElement | null => {
  if (images.length === 0) return null;

  return (
    <ul
      className={clsx('article-gallery__list', LAYOUT_MODIFIERS[layout ?? 'GALLERY_LAYOUT_GRID'])}
    >
      {images.map((image) => (
        <li key={image.url} className="article-gallery__item">
          <figure className="article-gallery__figure">
            <img
              src={image.url}
              alt={image.alt ?? ''}
              width={image.width}
              height={image.height}
              loading="lazy"
              className="article-gallery__image"
            />
            {image.caption && (
              <figcaption className="article-gallery__caption">{image.caption}</figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  );
};

export default ArticleGallery;
