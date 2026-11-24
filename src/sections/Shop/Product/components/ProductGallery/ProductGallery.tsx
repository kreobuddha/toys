import './ProductGallery.scss';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { ProductCondition } from '@/types/product';
import ConditionTag from '@components/ConditionTag/ConditionTag';
import Lightbox from '@components/Lightbox/Lightbox';
import { useLightbox } from '@components/Lightbox/useLightbox';

interface ProductGalleryProps {
  images: string[];
  alt: string;
  condition?: ProductCondition;
  soldOut?: boolean;
}

const ProductGallery = ({ images, alt, condition, soldOut }: ProductGalleryProps): ReactElement => {
  const { t } = useTranslation('shopSection');
  // One index for the gallery and the lightbox: it opens on the photo shown and closes on the
  // photo the viewer stopped at.
  const lightbox = useLightbox(images.length);
  const current = images[lightbox.index] ?? images[0];

  return (
    <div className="product-gallery" role="group" aria-label={t('product.gallery')}>
      <div className="product-gallery__stage">
        {current ? (
          <button
            type="button"
            className="product-gallery__main"
            aria-label={t('product.enlarge')}
            onClick={(event) => lightbox.open(event.currentTarget)}
          >
            <img src={current} alt={alt} className="product-gallery__image" />
          </button>
        ) : (
          <div className="product-gallery__main" />
        )}
        <ConditionTag
          condition={condition}
          soldOut={soldOut}
          size="lg"
          className="product-gallery__tag"
        />
      </div>
      {images.length > 1 && (
        <ul className="product-gallery__thumbs">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                className={clsx(
                  'product-gallery__thumb',
                  index === lightbox.index && 'product-gallery__thumb--active'
                )}
                aria-label={t('product.showImage', { index: index + 1 })}
                aria-pressed={index === lightbox.index}
                onClick={() => lightbox.select(index)}
              >
                <img src={src} alt="" loading="lazy" className="product-gallery__thumb-image" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Lightbox
        images={images}
        alt={alt}
        index={lightbox.index}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrevious={lightbox.previous}
      />
    </div>
  );
};

export default ProductGallery;
