import React, { useState } from "react";
import { Field } from "../Field/Field";
import { cn } from "../../lib/cn";
import { inputClasses, type InputSize } from "./styles";
import "./Input.css";
import { Icon } from "../Icon/Icon";

export type InputTrailingButton = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export type InputProps = {
  /** Input height */
  size?: InputSize;
  /** HTML input type */
  type?: string;
  /** Trailing action button (e.g. Apply) */
  trailingButton?: InputTrailingButton;
  /** Additional CSS class names on the chrome wrapper */
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
} & Omit<
  React.ComponentProps<typeof Field.Control>,
  "size" | "type" | "value" | "defaultValue" | "onChange" | "onValueChange" | "className"
>;

/**
 * Bare text control for use inside `Field`. Keeps clear / password reveal /
 * search icon / trailing button. Label, helper and error come from `Field`.
 *
 *   <Field.Root>
 *     <Field.Label>Email</Field.Label>
 *     <Input type="email" placeholder="hello@straitsx.com" />
 *     <Field.Description>We'll never share it.</Field.Description>
 *   </Field.Root>
 */
export function Input({
  type = "text",
  size = "large",
  disabled = false,
  className,
  value,
  defaultValue,
  onChange,
  onValueChange,
  trailingButton,
  ...inputProps
}: InputProps) {
  const isPassword = type === "password";
  const isSearch = type === "search";
  const [reveal, setReveal] = useState(false);
  const [internal, setInternal] = useState(String(defaultValue ?? ""));
  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value) : internal;

  const commit = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
    onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLInputElement>);
  };

  const showClear = !!currentValue && !disabled;
  const effectiveType = isPassword ? (reveal ? "text" : "password") : type;

  return (
    <div
      className={cn(
        inputClasses.root,
        inputClasses.size[size],
        trailingButton && inputClasses.withButton,
        className,
      )}
      data-disabled={disabled || undefined}
    >
      {isSearch && (
        <Icon name="search" className="input__lead" />
      )}
      <Field.Control
        type={effectiveType}
        disabled={disabled}
        value={currentValue}
        onValueChange={commit}
        className="input__control"
        {...inputProps}
      />
      {showClear && (
        <button type="button" className="input__icon-btn" onClick={() => commit("")} aria-label="Clear">
          <Icon name="close" />
        </button>
      )}
      {isPassword && !disabled && (
        <button
          type="button"
          className="input__icon-btn"
          onClick={() => setReveal((r) => !r)}
          aria-label={reveal ? "Hide password" : "Show password"}
        >
          <Icon name={reveal ? "visibility_off" : "visibility"} />
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
  );
}
