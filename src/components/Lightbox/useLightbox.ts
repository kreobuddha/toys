import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseLightboxResult {
  /** Image shown in the gallery and, while open, in the lightbox. */
  index: number;
  isOpen: boolean;
  select: (index: number) => void;
  /** Opens on the current image; focus returns to `trigger` once the lightbox closes. */
  open: (trigger: HTMLElement) => void;
  close: () => void;
  next: () => void;
  previous: () => void;
}

/**
 * Which image a gallery shows and whether its lightbox is open. The trigger is kept so a
 * keyboard user lands back on it instead of at the top of the document.
 */
export const useLightbox = (count: number): UseLightboxResult => {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((trigger: HTMLElement): void => {
    triggerRef.current = trigger;
    setIsOpen(true);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  // Focus goes back only once the dialog has closed: a modal <dialog> still in the top layer
  // keeps focus inside itself, so calling focus() from `close` would do nothing.
  useEffect(() => {
    if (isOpen || !triggerRef.current) return;
    triggerRef.current.focus();
    triggerRef.current = null;
  }, [isOpen]);

  const step = useCallback(
    (delta: number): void => {
      if (count > 0) setIndex((current) => (current + delta + count) % count);
    },
    [count]
  );

  const next = useCallback((): void => step(1), [step]);
  const previous = useCallback((): void => step(-1), [step]);

  return { index, isOpen, select: setIndex, open, close, next, previous };
};
