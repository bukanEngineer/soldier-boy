import React, { useId, useState } from "react";
import { inputClasses, type InputSize } from "./styles";
import "./Input.css";

export type InputTrailingButton = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export type InputProps = {
  /** Field label */
  label?: string;
  /** Helper text below the input */
  helper?: string;
  /** Error message (replaces helper when present) */
  error?: string;
  /** HTML input type */
  type?: string;
  /** Input height */
  size?: InputSize;
  /** Disables interaction */
  disabled?: boolean;
  /** Element id */
  id?: string;
  /** Additional CSS class names */
  className?: string;
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => void;
  /** Trailing action button config */
  trailingButton?: InputTrailingButton;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onChange">;

export function Input({
  label,
  helper,
  error,
  type = "text",
  size = "large",
  disabled = false,
  id: idProp,
  className = "",
  value,
  defaultValue,
  onChange,
  trailingButton,
  ...inputProps
}: InputProps) {
  const autoId = useId();
  const id = idProp || autoId;
  const isError = !!error;
  const isPassword = type === "password";
  const isSearch = type === "search";

  const [reveal, setReveal] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internal;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.value);
    onChange && onChange(e);
  };

  const wrapCls = [
    inputClasses.root,
    inputClasses.size[size],
    isError && inputClasses.state.error,
    disabled && inputClasses.state.disabled,
    trailingButton && inputClasses.withButton,
    className,
  ].filter(Boolean).join(" ");

  const effectiveType = isPassword ? (reveal ? "text" : "password") : type;

  const handleClear = () => {
    if (isControlled) {
      onChange && onChange({ target: { value: "" } });
    } else {
      setInternal("");
    }
  };

  const showClear = !!currentValue && !disabled;

  return (
    <div className="field">
      {label && <label htmlFor={id} className="field__label">{label}</label>}
      <div className={wrapCls}>
        {isSearch && (
          <span className="material-symbols-rounded input__lead" aria-hidden="true">search</span>
        )}
        <input
          id={id}
          type={effectiveType}
          disabled={disabled}
          value={currentValue}
          onChange={handleChange}
          {...inputProps}
        />
        {showClear && (
          <button
            type="button"
            className="input__icon-btn"
            onClick={handleClear}
            aria-label="Clear"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        )}
        {isPassword && !disabled && (
          <button
            type="button"
            className="input__icon-btn"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Hide password" : "Show password"}
          >
            <span className="material-symbols-rounded">{reveal ? "visibility_off" : "visibility"}</span>
          </button>
        )}
        {trailingButton && (
          <button
            type="button"
            className="input__trailing-btn"
            onClick={trailingButton.onClick}
            disabled={disabled || trailingButton.disabled}
          >
            {trailingButton.label}
          </button>
        )}
      </div>
      {(helper || error) && (
        <span className={"field__helper" + (isError ? " is-error" : "")}>
          {error || helper}
        </span>
      )}
    </div>
  );
}
