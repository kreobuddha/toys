import './Combobox.scss';
import {
  useId,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  type ReactElement,
} from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Input from '@components/Input/Input';

export interface ComboboxOption {
  /** Unique within the list. */
  id: string;
  label: string;
  hint?: string;
}

type ComboboxProps<T extends ComboboxOption> = Omit<
  ComponentProps<'input'>,
  'value' | 'onChange' | 'onSelect'
> & {
  id: string;
  label: string;
  value: string;
  /** Called with the text as the customer types it. */
  onChange: (value: string) => void;
  options: readonly T[];
  onSelect: (option: T) => void;
  /** Suggestions for the current text are on their way. */
  loading?: boolean;
  /** Suggestions for the current text arrived, so an empty list reads "No matches". */
  answered?: boolean;
};

/**
 * Text input with a suggestion list, following the WAI-ARIA combobox pattern. The list opens only
 * while the customer types; values set by code never open it. Without suggestions it is a plain
 * input.
 */
const Combobox = <T extends ComboboxOption>({
  id,
  label,
  value,
  onChange,
  options,
  onSelect,
  loading = false,
  answered = false,
  onBlur,
  onKeyDown,
  ...rest
}: ComboboxProps<T>): ReactElement => {
  const { t } = useTranslation();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // A new list starts without an active option. Reset while rendering, not in an effect.
  const optionsKey = options.map((option) => option.id).join('|');
  const [shownOptionsKey, setShownOptionsKey] = useState(optionsKey);
  if (shownOptionsKey !== optionsKey) {
    setShownOptionsKey(optionsKey);
    setActiveIndex(-1);
  }

  let status = '';
  if (loading) status = t('combobox.loading');
  else if (answered && options.length === 0) status = t('combobox.empty');

  const listVisible = open && options.length > 0;
  const popupVisible = listVisible || (open && status !== '');
  const optionId = (index: number): string => `${listId}-option-${index}`;

  const close = (): void => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const select = (option: T): void => {
    close();
    onSelect(option);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
    setOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    onKeyDown?.(event);
    // Keys that confirm an IME composition belong to the composition (Safari reports 229).
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (options.length === 0) return;
      event.preventDefault();
      const down = event.key === 'ArrowDown';
      setOpen(true);
      setActiveIndex((index) => {
        if (down) return index + 1 >= options.length ? 0 : index + 1;
        return index <= 0 ? options.length - 1 : index - 1;
      });
    } else if (event.key === 'Enter' && popupVisible) {
      // With the list on screen Enter picks or closes; otherwise it submits the form as usual.
      event.preventDefault();
      if (listVisible && activeIndex >= 0 && activeIndex < options.length) {
        select(options[activeIndex]);
      } else {
        close();
      }
    } else if (event.key === 'Escape' && popupVisible) {
      event.preventDefault();
      close();
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    close();
    onBlur?.(event);
  };

  return (
    <div className="combobox">
      <Input
        {...rest}
        id={id}
        label={label}
        value={value}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={listVisible}
        aria-controls={listVisible ? listId : undefined}
        aria-activedescendant={listVisible && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        autoCorrect="off"
        spellCheck={false}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      {popupVisible && (
        // Mouse down would blur the input and close the list before the click lands.
        <div className="combobox__popup" onMouseDown={(event) => event.preventDefault()}>
          {listVisible && (
            <ul id={listId} role="listbox" aria-label={label} className="combobox__list">
              {options.map((option, index) => (
                <li
                  key={option.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={clsx(
                    'combobox__option',
                    index === activeIndex && 'combobox__option--active'
                  )}
                  onClick={() => select(option)}
                >
                  <span className="combobox__label">{option.label}</span>
                  {option.hint && <span className="combobox__hint">{option.hint}</span>}
                </li>
              ))}
            </ul>
          )}
          {status && (
            <p className="combobox__status" role="status">
              {status}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Combobox;
