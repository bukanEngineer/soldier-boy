import React from "react";
import { cn } from "../../lib/cn";
import "./OptionList.css";

export type OptionListTagVariant = "positive" | "critical" | "warning" | "information";

export type OptionListTag = {
  label: React.ReactNode;
  variant?: OptionListTagVariant;
};

export type OptionListItem = {
  value: string;
  name?: string;
  /** Leading mark (logo / asset mark). Falls back to initials. */
  logo?: React.ReactNode;
  /** Supporting text under the name */
  secondary?: React.ReactNode;
  /** Trailing status tag */
  tag?: OptionListTag;
  /** Free-form trailing content (e.g. balance). Shown after `tag` when both are set. */
  trailing?: React.ReactNode;
  disabled?: boolean;
};

export type OptionListProps = Omit<React.ComponentProps<"ul">, "children"> & {
  options?: OptionListItem[];
  /** Currently selected value */
  value?: string;
  /** Called when an enabled option is picked */
  onValueChange?: (value: string, option: OptionListItem) => void;
};

/**
 * Shared listbox body for domain dropdowns (bank / blockchain / network / asset).
 * Mark + name + secondary + optional tag/trailing. Compose inside menus, sheets,
 * or free-standing panels — not a trigger.
 *
 *   <OptionList
 *     value={selected}
 *     onValueChange={setSelected}
 *     options={[{ value: "dbs", name: "DBS Bank", secondary: "•••• 1234" }]}
 *   />
 */
export function OptionList({
  options = [],
  value,
  onValueChange,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: OptionListProps) {
  return (
    <ul
      className={cn("option-list", className)}
      role="listbox"
      aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? "Options")}
      aria-labelledby={ariaLabelledBy}
      {...props}
    >
      {options.map((o) => {
        const selected = o.value === value;
        const label = o.name ?? o.value;
        return (
          <li key={o.value} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              disabled={o.disabled}
              data-selected={selected || undefined}
              data-disabled={o.disabled || undefined}
              className="option-list__row"
              onClick={() => onValueChange?.(o.value, o)}
            >
              <span className="option-list__mark" aria-hidden="true">
                {o.logo || (
                  <span className="option-list__initials">
                    {String(label || "?").slice(0, 2).toUpperCase()}
                  </span>
                )}
              </span>
              <span className="option-list__text">
                <span className="option-list__name">{label}</span>
                {o.secondary != null && o.secondary !== "" && (
                  <span className="option-list__secondary">{o.secondary}</span>
                )}
              </span>
              {o.tag && (
                <span
                  className="option-list__tag"
                  data-variant={o.tag.variant || "positive"}
                >
                  {o.tag.label}
                </span>
              )}
              {o.trailing != null && (
                <span className="option-list__trailing">{o.trailing}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
