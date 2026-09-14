import './Lightbox.scss';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface LightboxProps {
  images: string[];
  alt: string;
  index: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface LightboxImageProps {
  src: string;
  alt: string;
}

/**
 * A click switches between fitting the stage and the natural size, which scrolls. Rendered
 * with `key={index}`, so the next image starts fitted again without an effect.
 */
const LightboxImage = ({ src, alt }: LightboxImageProps): ReactElement => {
  const { t } = useTranslation();
  const [zoomed, setZoomed] = useState(false);

  return (
    <button
      type="button"
      className={clsx('lightbox__zoom', zoomed && 'lightbox__zoom--active')}
      aria-label={t('lightbox.zoom')}
      aria-pressed={zoomed}
      onClick={() => setZoomed((value) => !value)}
    >
      <img
        src={src}
        alt={alt}
        className={clsx('lightbox__image', zoomed && 'lightbox__image--zoomed')}
      />
    </button>
  );
};

/**
 * Full-size image viewer on a native modal <dialog>: the browser provides the top layer, the
 * backdrop, the focus trap and Esc. The dialog stays mounted; `isOpen` drives it.
 */
const Lightbox = ({
  images,
  alt,
  index,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps): ReactElement => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const src = images[index];
  const hasMany = images.length > 1;

  // showModal() has to be called imperatively: the `open` attribute alone gives no top layer,
  // backdrop or focus trap. Checking `dialog.open` keeps StrictMode's repeated effects harmless.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // The page behind a modal dialog still scrolls under a trackpad.
  useEffect(() => {
    if (!isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>): void => {
    if (!hasMany) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onPrevious();
    }
  };

  const handleClick = (event: MouseEvent<HTMLDialogElement>): void => {
    // Only a click on the backdrop has the dialog itself as the target.
    if (event.target === event.currentTarget) onClose();
  };

  // close() only queues the close event, so after a quick reopen a late one can arrive while the
  // dialog is open again; it must not close the new session.
  const handleClose = (): void => {
    if (!dialogRef.current?.open) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={t('lightbox.label')}
      onCancel={onClose}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <div className="lightbox__frame">
        <div className="lightbox__top">
          {hasMany && (
            <span className="lightbox__counter">
              {t('lightbox.counter', { current: index + 1, total: images.length })}
            </span>
          )}
          <button
            type="button"
            className="lightbox__control lightbox__control--close"
            aria-label={t('lightbox.close')}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="lightbox__stage">
          {isOpen && src && <LightboxImage key={index} src={src} alt={alt} />}
        </div>
        {hasMany && (
          <div className="lightbox__nav">
            <button
              type="button"
              className="lightbox__control"
              aria-label={t('lightbox.previous')}
              onClick={onPrevious}
            >
              ←
            </button>
            <button
              type="button"
              className="lightbox__control"
              aria-label={t('lightbox.next')}
              onClick={onNext}
            >
              →
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default Lightbox;
