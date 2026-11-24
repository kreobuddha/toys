import './FilterGroup.scss';
import { useId, useState, type ReactElement } from 'react';
import Checkbox from '@components/Checkbox/Checkbox';

interface FilterGroupProps<T extends string> {
  legend: string;
  options: readonly { value: T; label: string }[];
  selected: readonly T[];
  onChange: (selected: T[]) => void;
}

/**
 * A foldable list of checkboxes; any number of options can be picked. Folded, it still lists
 * what is picked, so the active filters stay visible.
 */
const FilterGroup = <T extends string>({
  legend,
  options,
  selected,
  onChange,
}: FilterGroupProps<T>): ReactElement => {
  const listId = useId();
  const [open, setOpen] = useState(true);
  const picked = options.filter((option) => selected.includes(option.value));

  const handleToggle = (value: T, checked: boolean): void => {
    onChange(checked ? [...selected, value] : selected.filter((item) => item !== value));
  };

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__legend">
        <button
          type="button"
          className="filter-group__toggle"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
        >
          {legend}
          <img src="/icons/chevron-down.svg" alt="" className="filter-group__chevron" />
        </button>
      </legend>
      {!open && picked.length > 0 && (
        <p className="filter-group__picked">{picked.map((option) => option.label).join(', ')}</p>
      )}
      <ul id={listId} className="filter-group__list" hidden={!open}>
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
