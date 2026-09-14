import { useTranslation } from 'react-i18next';
import { AGE_GROUPS } from '@/api/productAttributes';
import type { AgeGroup, Condition } from '@/api/types';
import { useLocale } from './LocaleContext';

// Explicit map so the keys stay type-checked against the translation file.
const CONDITION_LABELS = {
  new: 'condition.new',
  excellent: 'condition.excellent',
  good: 'condition.good',
} as const satisfies Record<Condition, string>;

export interface ProductLabels {
  /** Age filter option in years: "0–0.5", "3+". */
  ageGroup: (id: AgeGroup) => string;
  /** Ages a product suits, spanning its groups: "1–2 years", "3+ years". */
  ageRange: (groups: readonly AgeGroup[]) => string;
  condition: (condition: Condition) => string;
}

/** Display labels for product attributes in the current language. */
export const useProductLabels = (): ProductLabels => {
  const { t } = useTranslation();
  const locale = useLocale();

  const years = (months: number): string =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(months / 12);

  const ageGroup = (id: AgeGroup): string => {
    const group = AGE_GROUPS.find((g) => g.id === id);
    if (!group) return id;
    return group.to === undefined
      ? t('age.groupOpen', { from: years(group.from) })
      : t('age.group', { from: years(group.from), to: years(group.to) });
  };

  const ageRange = (groups: readonly AgeGroup[]): string => {
    const matched = AGE_GROUPS.filter((g) => groups.includes(g.id));
    if (matched.length === 0) return '';
    const from = matched[0].from;
    const to = matched[matched.length - 1].to;
    return to === undefined
      ? t('age.rangeOpen', { from: years(from) })
      : t('age.range', { from: years(from), to: years(to) });
  };

  const condition = (value: Condition): string => t(CONDITION_LABELS[value]);

  return { ageGroup, ageRange, condition };
};
