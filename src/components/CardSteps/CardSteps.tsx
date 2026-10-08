import React from "react";
import { SelectionBox } from "../SelectionBox/SelectionBox";
import { Radio } from "../Radio/Radio";
import { Card } from "../Card/Card";
import { cn } from "../../lib/cn";
import "./CardSteps.css";
import { resolveIcon, type IconSource } from "../Icon/Icon";

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
    <Card className={cn("card-steps", className)} {...rest}>
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
    </Card>
  );
}

export type CardStepsOption = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: IconSource;
  disabled?: boolean;
};

export type CardStepsOptionsProps = {
  options?: CardStepsOption[];
  selected?: string;
  onSelect?: (value: string) => void;
  className?: string;
};

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
