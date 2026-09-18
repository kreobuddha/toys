import { useTranslation } from 'react-i18next';
import { AGE_RANGE_MONTHS } from '@/constants/productAttributes';
import type { ProductAgeRange, ProductCondition } from '@/types/product';
import { useLocale } from './LocaleContext';

// Age ranges and conditions are protobuf enums, so their names live here and follow the
// interface language. Category and brand names come from the catalog itself.

// Explicit map so the keys stay type-checked against the translation file.
const CONDITION_LABELS = {
  PRODUCT_CONDITION_UNSPECIFIED: '',
  PRODUCT_CONDITION_NEW: 'condition.new',
  PRODUCT_CONDITION_PRELOVED: 'condition.preloved',
} as const satisfies Record<ProductCondition, string>;

export interface ProductLabels {
  /** Age filter option in years: "0–0.5", "3+". */
  ageOption: (range: ProductAgeRange) => string;
  /** Ages a product suits, spanning all of its ranges: "1–2 years", "3+ years". */
  ageSpan: (ranges?: readonly ProductAgeRange[]) => string;
  condition: (condition?: ProductCondition) => string;
}

/** Display labels for product attributes in the current language. */
export const useProductLabels = (): ProductLabels => {
  const { t } = useTranslation('shopSection');
  const locale = useLocale();

  const years = (months: number): string =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(months / 12);

  const ageOption = (range: ProductAgeRange): string => {
    const { from, to } = AGE_RANGE_MONTHS[range];
    return to === undefined
      ? t('age.groupOpen', { from: years(from) })
      : t('age.group', { from: years(from), to: years(to) });
  };

  const ageSpan = (ranges?: readonly ProductAgeRange[]): string => {
    const bounds = (ranges ?? [])
      .filter((range) => range !== 'PRODUCT_AGE_RANGE_UNSPECIFIED')
      .map((range) => AGE_RANGE_MONTHS[range]);
    if (bounds.length === 0) return '';
    const from = Math.min(...bounds.map((bound) => bound.from));
    // An open-ended range anywhere in the list opens the whole span.
    const open = bounds.some((bound) => bound.to === undefined);
    const to = open ? undefined : Math.max(...bounds.map((bound) => bound.to ?? 0));
    return to === undefined
      ? t('age.rangeOpen', { from: years(from) })
      : t('age.range', { from: years(from), to: years(to) });
  };

  const condition = (value?: ProductCondition): string => {
    const key = value && CONDITION_LABELS[value];
    return key ? t(key) : '';
  };

  return { ageOption, ageSpan, condition };
};
