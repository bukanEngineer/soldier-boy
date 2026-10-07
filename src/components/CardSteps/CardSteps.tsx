import React from "react";
import { SelectionBox } from "../SelectionBox/SelectionBox";
import { Radio } from "../Radio/Radio";
import { cn } from "../../lib/cn";
import "./CardSteps.css";

export type CardStepsProps = Omit<React.ComponentProps<"section">, "title"> & {
  step?: number | string;
  title?: React.ReactNode;
  helperText?: React.ReactNode;
};

/** Numbered step card. Compose options via `CardSteps.Options`. */
export function CardSteps({
  step = 1,
  title,
  helperText,
  children,
  className,
  ...rest
}: CardStepsProps) {
  return (
    <section className={cn("card-steps", className)} {...rest}>
      <div className="card-steps__head">
        <span className="card-steps__counter num">{step}</span>
        {title != null && <p className="card-steps__title">{title}</p>}
      </div>
      {(children || helperText) && (
        <div className="card-steps__content">
          {children}
          {helperText && <p className="card-steps__helper">{helperText}</p>}
        </div>
      )}
    </section>
  );
}

export type CardStepsOption = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode | string;
  disabled?: boolean;
};

export type CardStepsOptionsProps = {
  options?: CardStepsOption[];
  selected?: string;
  onSelect?: (value: string) => void;
  className?: string;
};

function resolveIcon(icon?: React.ReactNode | string) {
  if (!icon) return undefined;
  if (typeof icon === "string") {
    return (
      <span className="material-symbols-rounded" aria-hidden="true">
        {icon}
      </span>
    );
  }
  return icon;
}

function CardStepsOptions({
  options = [],
  selected,
  onSelect,
  className,
}: CardStepsOptionsProps) {
  return (
    <Radio.Group
      className={cn("card-steps__options", className)}
      value={selected}
      onValueChange={(value) => onSelect?.(String(value))}
    >
      {options.map((opt) => (
        <SelectionBox
          key={opt.id}
          type="radio"
          value={opt.id}
          label={opt.label}
          description={opt.description}
          icon={resolveIcon(opt.icon)}
          disabled={opt.disabled}
        />
      ))}
    </Radio.Group>
  );
}

CardSteps.Options = CardStepsOptions;
