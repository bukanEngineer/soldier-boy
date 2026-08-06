import React, { useId } from "react";
import "../Checkbox/Checkbox.css";
import "./Radio.css";

export type RadioProps = {
  /** Radio label */
  label?: string;
  /** Secondary description text */
  sub?: string;
  /** Controlled checked state */
  checked?: boolean;
  /** Uncontrolled default checked state */
  defaultChecked?: boolean;
  /** Disables interaction */
  disabled?: boolean;
  /** Show error styling */
  error?: boolean;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Radio group name */
  name?: string;
  /** Radio value */
  value?: string;
  /** Element id */
  id?: string;
  /** Additional CSS class names */
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange">;

export function Radio({
  label,
  sub,
  checked,
  defaultChecked,
  disabled = false,
  error = false,
  onChange,
  name,
  value,
  id: idProp,
  className = "",
  ...inputProps
}: RadioProps) {
  const id = useId();
  const cls = [
    "control",
    sub && "has-sub",
    disabled && "is-disabled",
    error && "is-error",
    className,
  ].filter(Boolean).join(" ");
  return (
    <label htmlFor={idProp || id} className={cls}>
      <input
        type="radio"
        id={idProp || id}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        {...inputProps}
      />
      <span className="radio__box" aria-hidden="true" />
      {label && (
        <span className="control__label">
          {label}
          {sub && <span className="control__sub">{sub}</span>}
        </span>
      )}
    </label>
  );
}

export type RadioGroupOption = {
  value: string;
  label: string;
  sub?: string;
};

export type RadioGroupProps = {
  /** Radio group name */
  name: string;
  /** Controlled selected value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** List of radio options */
  options?: RadioGroupOption[];
  /** Fieldset legend */
  legend?: string;
  /** Additional CSS class names */
  className?: string;
};

export function RadioGroup({ name, value, onChange, options = [], legend, className = "" }: RadioGroupProps) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }} className={className}>
      {legend && <legend style={{ font: "var(--label-medium)", color: "var(--text-primary)", padding: 0, marginBottom: 4 }}>{legend}</legend>}
      {options.map((o) => (
        <Radio
          key={o.value}
          name={name}
          value={o.value}
          label={o.label}
          sub={o.sub}
          checked={value === o.value}
          onChange={() => onChange && onChange(o.value)}
        />
      ))}
    </fieldset>
  );
}
