import React from "react";
import { Checkbox } from "../Checkbox/Checkbox";
import { Radio } from "../Radio/Radio";
import { cn } from "../../lib/cn";
import "./SelectionBox.css";

export type SelectionBoxProps = {
  /** `radio` for single-select rows (use inside `Radio.Group`); `check` for multi-select. */
  type?: "radio" | "check";
  /** Controlled checked state for `type="check"`. Radio selection comes from `Radio.Group`. */
  selected?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Custom leading visual (radio type only). */
  icon?: React.ReactNode;
  value?: string;
  onChange?: (selected: boolean, details?: unknown) => void;
  id?: string;
  className?: string;
};

/**
 * Bordered selectable row built on `Radio` / `Checkbox`.
 */
export function SelectionBox({
  type = "radio",
  selected = false,
  disabled = false,
  label,
  description,
  icon,
  value,
  onChange,
  id,
  className = "",
}: SelectionBoxProps) {
  const useIcon = type === "radio" && !!icon;
  const cls = cn("selbox", `selbox--${type}`, useIcon && "selbox--icon", className);

  const content = (
    <span className="selbox__content">
      {label && <span className="selbox__label">{label}</span>}
      {description && <span className="selbox__desc">{description}</span>}
    </span>
  );

  if (type === "check") {
    return (
      <label className={cls} htmlFor={id}>
        <Checkbox.Root
          id={id}
          checked={selected}
          disabled={disabled}
          onCheckedChange={(next, details) => onChange?.(next, details)}
          className="selbox__control"
        >
          <Checkbox.Indicator />
        </Checkbox.Root>
        {content}
      </label>
    );
  }

  return (
    <label className={cls} htmlFor={id}>
      {useIcon ? (
        <span className="selbox__indicator selbox__indicator--custom" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <Radio.Root
        id={id}
        value={value}
        disabled={disabled}
        className={cn("selbox__control", useIcon && "selbox__control--hidden")}
      >
        {!useIcon && <Radio.Indicator />}
      </Radio.Root>
      {content}
    </label>
  );
}
