import React from "react";
import { cn } from "../../lib/cn";
import "./StatusIcon.css";
import { Icon, type IconName } from "../Icon/Icon";

export type StatusIconVariant = "success" | "needApproval" | string;

export type StatusIconProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Visual status */
  variant?: StatusIconVariant;
  /** Icon name override */
  icon?: IconName;
  /** Diameter in px */
  size?: number;
};

/**
 * Circular status glyph used in cards and confirmation screens.
 *
 *   <StatusIcon variant="success" size={36} />
 */
export function StatusIcon({
  variant = "success",
  icon,
  size = 36,
  className,
  style,
  "aria-label": ariaLabel,
  ...rest
}: StatusIconProps) {
  const defaultIcon = variant === "needApproval" ? "hourglass_top" : "check";
  const defaultLabel = variant === "needApproval" ? "Needs approval" : "Success";
  return (
    <span
      role="img"
      aria-label={ariaLabel ?? defaultLabel}
      data-variant={variant}
      className={cn("status-icon", `status-icon--${variant}`, className)}
      style={{ ["--status-icon-size" as string]: `${size}px`, ...style }}
      {...rest}
    >
      <Icon name={icon || defaultIcon} />
    </span>
  );
}
