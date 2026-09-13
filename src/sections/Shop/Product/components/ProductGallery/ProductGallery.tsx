import './ProductGallery.scss';
import { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

const ProductGallery = ({ images, alt }: ProductGalleryProps): ReactElement => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="product-gallery" role="group" aria-label={t('product.gallery')}>
      <div className="product-gallery__main">
        {current && <img src={current} alt={alt} className="product-gallery__image" />}
      </div>
      {images.length > 1 && (
        <ul className="product-gallery__thumbs">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                className={clsx(
                  'product-gallery__thumb',
                  index === active && 'product-gallery__thumb--active'
                )}
                aria-label={t('product.showImage', { index: index + 1 })}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              >
                <img src={src} alt="" loading="lazy" className="product-gallery__thumb-image" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductGallery;
