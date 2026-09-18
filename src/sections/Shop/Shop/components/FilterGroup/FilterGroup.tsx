import './FilterGroup.scss';
import type { ReactElement } from 'react';
import Checkbox from '@components/Checkbox/Checkbox';

interface FilterGroupProps<T extends string> {
  legend: string;
  options: readonly { value: T; label: string }[];
  selected: readonly T[];
  onChange: (selected: T[]) => void;
}

/** A fieldset of checkboxes; any number of options can be picked. */
const FilterGroup = <T extends string>({
  legend,
  options,
  selected,
  onChange,
}: FilterGroupProps<T>): ReactElement => {
  const handleToggle = (value: T, checked: boolean): void => {
    onChange(checked ? [...selected, value] : selected.filter((item) => item !== value));
  };

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__legend">{legend}</legend>
      <ul className="filter-group__list">
        {options.map((option) => (
          <li key={option.value}>
            <Checkbox
              label={option.label}
              checked={selected.includes(option.value)}
              onChange={(event) => handleToggle(option.value, event.target.checked)}
            />
          </li>
        ))}
      </ul>
    </fieldset>
  );
};

export default FilterGroup;
