import React, { useId, useState } from "react";
import "../Input/Input.css";
import "./Textarea.css";

export type TextareaProps = {
  /** Field label */
  label?: string;
  /** Helper text below the textarea */
  helper?: string;
  /** Error message (replaces helper when present) */
  error?: string;
  /** Max character length */
  maxLength?: number;
  /** Show character count */
  showCount?: boolean;
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Disables interaction */
  disabled?: boolean;
  /** Element id */
  id?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Additional CSS class names */
  className?: string;
  /** Number of visible text rows */
  rows?: number;
  /** Visual state override for stories/Chromatic */
  state?: "hovered" | "focused";
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">;

export function Textarea({
  label,
  helper,
  error,
  maxLength,
  showCount = false,
  value,
  defaultValue = "",
  disabled = false,
  id: idProp,
  onChange,
  className = "",
  rows = 4,
  state,
  ...rest
}: TextareaProps) {
  const id = useId();
  const isError = !!error;
  const [internal, setInternal] = useState(defaultValue);
  const v = value ?? internal;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setInternal(e.target.value);
    onChange && onChange(e);
  };
  const wrapCls = [
    "textarea-wrap",
    state === "hovered" && "is-hovered",
    state === "focused" && "is-focused",
    isError && "is-error",
    disabled && "is-disabled",
  ].filter(Boolean).join(" ");
  return (
    <div className={"field " + className}>
      {label && <label htmlFor={idProp || id} className="field__label">{label}</label>}
      <div className={wrapCls}>
        <textarea
          id={idProp || id}
          rows={rows}
          value={v}
          onChange={handleChange}
          disabled={disabled}
          maxLength={maxLength}
          {...rest}
        />
        {(showCount || maxLength) && (
          <span className="textarea-wrap__count">
            {String(v).length}{maxLength ? `/${maxLength}` : ""}
          </span>
        )}
      </div>
      {(helper || error) && (
        <span className={"field__helper" + (isError ? " is-error" : "")}>{error || helper}</span>
      )}
    </div>
  );
}
