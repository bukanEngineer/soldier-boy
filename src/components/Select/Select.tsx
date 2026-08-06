import React, { useId, useState } from "react";
import { Menu } from "../Menu/Menu";
import { selectClasses, type SelectSize } from "./styles";
import "./Select.css";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  /** Field label */
  label?: string;
  /** Helper text below the select */
  helper?: string;
  /** Error message (replaces helper when present) */
  error?: string;
  /** List of options */
  options?: SelectOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Select height */
  size?: SelectSize;
  /** Disables interaction */
  disabled?: boolean;
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string, option: SelectOption | null) => void;
  /** Element id */
  id?: string;
  /** Additional CSS class names */
  className?: string;
};

export function Select({
  label,
  helper,
  error,
  options = [],
  placeholder = "Select…",
  size = "large",
  disabled = false,
  value,
  defaultValue,
  onChange,
  id: idProp,
  className = "",
  ...rest
}: SelectProps) {
  const autoId = useId();
  const id = idProp || autoId;
  const isError = !!error;
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const selectedValue = isControlled ? value : internal;
  const selectedOption = options.find((o) => o.value === selectedValue);

  const select = (option: SelectOption) => {
    if (!isControlled) setInternal(option.value);
    onChange && onChange(option.value, option);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) setInternal("");
    onChange && onChange("", null);
  };

  return (
    <div className={"field " + className}>
      {label && (
        <span className="field__label" id={`${id}-label`}>{label}</span>
      )}
      <Menu
        className={selectClasses.menu}
        trigger={({ onClick, open }: { onClick: () => void; open: boolean }) => (
          <button
            type="button"
            id={id}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-labelledby={label ? `${id}-label` : undefined}
            onClick={onClick}
            className={[
              selectClasses.root,
              selectClasses.size[size],
              isError && selectClasses.state.error,
              disabled && selectClasses.state.disabled,
            ].filter(Boolean).join(" ")}
            {...rest}
          >
            <span className="select__value">
              {selectedOption ? (
                selectedOption.label
              ) : (
                <span className="select__placeholder">{placeholder}</span>
              )}
            </span>
            {selectedOption && !disabled && (
              <span
                className="material-symbols-rounded select__clear"
                role="button"
                aria-label="Clear selection"
                onClick={clear}
              >
                close
              </span>
            )}
            <span className="material-symbols-rounded select__chevron" aria-hidden="true">expand_more</span>
          </button>
        )}
      >
        {options.map((o) => (
          // @ts-ignore Menu.Item props will be typed when Menu is migrated to TypeScript
          <Menu.Item
            key={o.value}
            selectable="single"
            selected={o.value === selectedValue}
            disabled={o.disabled}
            onSelect={() => select(o)}
          >
            {o.label}
          </Menu.Item>
        ))}
      </Menu>
      {(helper || error) && (
        <span className={"field__helper" + (isError ? " is-error" : "")}>{error || helper}</span>
      )}
    </div>
  );
}
