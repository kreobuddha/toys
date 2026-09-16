import './PriceFilter.scss';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { CURRENCY, PRICE_STEP } from '@/constants/productAttributes';
import { formatPrice, useLocale } from '@/i18n';
import type { IPriceRange } from '@/types/product';
import RangeSlider, { type RangeValue } from '@components/RangeSlider/RangeSlider';

interface PriceFilterProps {
  bounds: IPriceRange;
  min?: number;
  max?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
}

const COMMIT_DELAY_MS = 300;

/**
 * Price range slider. Dragging moves a local draft at once and reaches the URL after a pause,
 * so a drag does not fire a request per step. An end left on its bound is no restriction.
 */
const PriceFilter = ({ bounds, min, max, onChange }: PriceFilterProps): ReactElement => {
  const { t } = useTranslation('shopSection');
  const locale = useLocale();
  const [draft, setDraft] = useState({ min, max });

  // Adopt changes from outside (Reset, Back) without an effect.
  const [committed, setCommitted] = useState({ min, max });
  if (committed.min !== min || committed.max !== max) {
    setCommitted({ min, max });
    setDraft({ min, max });
  }

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (draft.min === min && draft.max === max) return;
    const timer = setTimeout(() => onChangeRef.current(draft.min, draft.max), COMMIT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [draft, min, max]);

  const low = draft.min ?? bounds.min;
  const high = draft.max ?? bounds.max;
  const price = (value: number): string => formatPrice(value, CURRENCY, locale);

  const handleChange = ([nextLow, nextHigh]: RangeValue): void => {
    setDraft({
      min: nextLow > bounds.min ? nextLow : undefined,
      max: nextHigh < bounds.max ? nextHigh : undefined,
    });
  };

  return (
    <fieldset className="price-filter">
      <legend className="price-filter__legend">{t('shop.price')}</legend>
      <p className="price-filter__values">
        {price(low)} – {price(high)}
      </p>
      <RangeSlider
        min={bounds.min}
        max={bounds.max}
        step={PRICE_STEP}
        value={[low, high]}
        labels={[t('shop.priceMin'), t('shop.priceMax')]}
        formatValue={price}
        onChange={handleChange}
      />
    </fieldset>
  );
};

export default PriceFilter;
