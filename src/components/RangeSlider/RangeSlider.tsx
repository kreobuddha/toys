import './RangeSlider.scss';
import type { ChangeEvent, ReactElement } from 'react';
import clsx from 'clsx';

export type RangeValue = [number, number];

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  /** Accessible names of the lower and the upper thumb. */
  labels: [string, string];
  /** Value as screen readers announce it, e.g. a formatted price. */
  formatValue?: (value: number) => string;
}

/**
 * Two native range inputs stacked on one track, so keyboard and screen reader support is the
 * browser's own. The inputs let the pointer through and only their thumbs catch it; the thumbs
 * cannot pass each other.
 */
const RangeSlider = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  labels,
  formatValue,
}: RangeSliderProps): ReactElement => {
  const [low, high] = value;
  const span = max - min || 1;
  const percent = (v: number): number => ((v - min) / span) * 100;
  // Thumbs that meet near the top end would bury the lower one under the upper input.
  const lowOnTop = low > min + span / 2;

  const handleLowChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange([Math.min(Number(event.target.value), high), high]);
  };

  const handleHighChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange([low, Math.max(Number(event.target.value), low)]);
  };

  return (
    <div className="range-slider">
      <div className="range-slider__track">
        <div
          className="range-slider__fill"
          style={{ left: `${percent(low)}%`, right: `${100 - percent(high)}%` }}
        />
      </div>
      <input
        type="range"
        className={clsx('range-slider__input', lowOnTop && 'range-slider__input--top')}
        min={min}
        max={max}
        step={step}
        value={low}
        aria-label={labels[0]}
        aria-valuetext={formatValue?.(low)}
        onChange={handleLowChange}
      />
      <input
        type="range"
        className="range-slider__input"
        min={min}
        max={max}
        step={step}
        value={high}
        aria-label={labels[1]}
        aria-valuetext={formatValue?.(high)}
        onChange={handleHighChange}
      />
    </div>
  );
};

export default RangeSlider;
