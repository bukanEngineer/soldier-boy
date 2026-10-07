import React, { useState } from "react";
import { Field } from "../Field/Field";
import { cn } from "../../lib/cn";
import "./Textarea.css";

export type TextareaProps = {
  /** Max character length */
  maxLength?: number;
  /** Show character count */
  showCount?: boolean;
  /** Visible rows */
  rows?: number;
  /** Additional CSS class names on the chrome wrapper */
  className?: string;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
};

/**
 * Bare textarea for use inside `Field`. Label / helper / error come from `Field`.
 */
export function Textarea({
  maxLength,
  showCount = false,
  value,
  defaultValue = "",
  disabled = false,
  onChange,
  className = "",
  rows = 4,
  ...rest
}: TextareaProps) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = (isControlled ? value : internal) as string;

  return (
    <div className={cn("textarea", className)} data-disabled={disabled || undefined}>
      <Field.Control
        disabled={disabled}
        value={current}
        onValueChange={(next) => {
          if (!isControlled) setInternal(next);
          onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLTextAreaElement>);
        }}
        render={(props) => (
          <textarea
            {...props}
            rows={rows}
            maxLength={maxLength}
            className={cn("textarea__control", props.className)}
          />
        )}
        {...rest}
      />
      {(showCount || maxLength != null) && (
        <span className="textarea__count">
          {String(current).length}
          {maxLength != null ? `/${maxLength}` : ""}
        </span>
      )}
    </div>
  );
}
