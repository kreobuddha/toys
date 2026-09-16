import { useTranslation } from 'react-i18next';
import { AGE_RANGE_MONTHS } from '@/constants/productAttributes';
import type { ProductAgeRange, ProductCategory, ProductCondition } from '@/types/product';
import { useLocale } from './LocaleContext';

// Explicit maps so the keys stay type-checked against the translation file. Category, age and
// condition names live on the frontend because the catalog contract has them as protobuf enums.

const CATEGORY_LABELS = {
  PRODUCT_CATEGORY_UNSPECIFIED: '',
  PRODUCT_CATEGORY_BUILDING: 'category.building',
  PRODUCT_CATEGORY_PUZZLES: 'category.puzzles',
  PRODUCT_CATEGORY_SORTERS: 'category.sorters',
  PRODUCT_CATEGORY_PRACTICAL_LIFE: 'category.practicalLife',
  PRODUCT_CATEGORY_PYRAMIDS: 'category.pyramids',
  PRODUCT_CATEGORY_BALANCING: 'category.balancing',
} as const satisfies Record<ProductCategory, string>;

const CONDITION_LABELS = {
  PRODUCT_CONDITION_UNSPECIFIED: '',
  PRODUCT_CONDITION_NEW: 'condition.new',
  PRODUCT_CONDITION_PRELOVED: 'condition.preloved',
} as const satisfies Record<ProductCondition, string>;

export interface ProductLabels {
  /** Age filter option in years: "0–0.5", "3+". */
  ageOption: (range: ProductAgeRange) => string;
  /** Ages a product suits: "1–1.5 years", "3+ years". */
  ageRange: (range?: ProductAgeRange) => string;
  condition: (condition?: ProductCondition) => string;
  category: (category?: ProductCategory) => string;
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

  const ageRange = (range?: ProductAgeRange): string => {
    if (!range || range === 'PRODUCT_AGE_RANGE_UNSPECIFIED') return '';
    const { from, to } = AGE_RANGE_MONTHS[range];
    return to === undefined
      ? t('age.rangeOpen', { from: years(from) })
      : t('age.range', { from: years(from), to: years(to) });
  };

  const condition = (value?: ProductCondition): string => {
    const key = value && CONDITION_LABELS[value];
    return key ? t(key) : '';
  };

  const category = (value?: ProductCategory): string => {
    const key = value && CATEGORY_LABELS[value];
    return key ? t(key) : '';
  };

  return { ageOption, ageRange, condition, category };
};
