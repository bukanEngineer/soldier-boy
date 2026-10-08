import React from "react";
import { cn } from "../../lib/cn";
import { tagClasses, type TagVariant, type TagTone, type TagSize } from "./styles";
import "./Tag.css";
import { Icon, type IconSource } from "../Icon/Icon";

export type TagProps = Omit<React.ComponentProps<"span">, "onClick"> & {
  /** Visual variant */
  variant?: TagVariant;
  /** Color tone (only applies to "outlined" variant) */
  tone?: TagTone;
  /** Tag size */
  size?: TagSize;
  /** Leading icon — string renders as Material Symbol, ReactNode rendered as-is */
  icon?: IconSource;
  /** Show remove button */
  removable?: boolean;
  /** Called when remove button is clicked */
  onRemove?: (e: React.MouseEvent) => void;
  /** Render as a selectable chip (button element) */
  clickable?: boolean;
  /** Whether the chip is selected (clickable mode only) */
  selected?: boolean;
  /** Disables interaction */
  disabled?: boolean;
  /** Click handler (clickable mode only) */
  onClick?: (e: React.MouseEvent) => void;
};

/**
 * Status / filter chip. Use `children` for the label.
 *
 *   <Tag tone="positive">Verified</Tag>
 *   <Tag clickable selected onClick={…}>XSGD</Tag>
 */
export function Tag({
  variant = "outlined",
  tone = "neutral",
  size = "large",
  icon,
  removable = false,
  onRemove,
  clickable = false,
  selected = false,
  disabled = false,
  onClick,
  className,
  children,
  ...rest
}: TagProps) {
  const classes = cn(
    tagClasses.root,
    tagClasses.variant[variant],
    variant === "outlined" && tagClasses.tone[tone],
    tagClasses.size[size],
    clickable && tagClasses.clickable,
    className,
  );

  const leadingIcon =
    icon == null ? null : typeof icon === "string" ? (
      <Icon name={icon} className="tag__icon" />
    ) : (
      <span className="tag__icon" aria-hidden="true">
        {icon}
      </span>
    );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onRemove?.(e);
  };

  const closeBtn = removable ? (
    <button
      type="button"
      className="tag__remove"
      aria-label="Remove"
      onClick={handleRemove}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" fill="none">
        <path
          d="M3 3 L9 9 M9 3 L3 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  ) : null;

  const inner = (
    <>
      {leadingIcon}
      <span className="tag__label">{children}</span>
      {closeBtn}
    </>
  );

  if (clickable) {
    return (
      <button
        type="button"
        className={classes}
        data-selected={selected || undefined}
        data-disabled={disabled || undefined}
        aria-pressed={selected}
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        {...(rest as React.ComponentProps<"button">)}
      >
        {inner}
      </button>
    );
  }

  return (
    <span className={classes} data-disabled={disabled || undefined} {...rest}>
      {inner}
    </span>
  );
}
