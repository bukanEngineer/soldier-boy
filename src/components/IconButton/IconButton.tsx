import React from "react";
import { iconButtonClasses, type IconButtonVariant, type IconButtonShape, type IconButtonSize } from "./styles";
import "./IconButton.css";

export type IconButtonProps = {
  /** Material Symbol icon name */
  icon: string;
  /** Visual style variant */
  variant?: IconButtonVariant;
  /** Button shape */
  shape?: IconButtonShape;
  /** Button size */
  size?: IconButtonSize;
  /** Accessible label (required for icon-only buttons) */
  label: string;
  /** Disables interaction */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** HTML button type attribute */
  type?: "button" | "submit" | "reset";
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export function IconButton({
  icon,
  variant = "tertiary",
  shape = "circle",
  size = "lg",
  label,
  disabled = false,
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  const cls = [
    iconButtonClasses.root,
    iconButtonClasses.variant[variant],
    iconButtonClasses.shape[shape],
    iconButtonClasses.size[size],
    className,
  ].filter(Boolean).join(" ");
  return (
    <button type={type} className={cls} disabled={disabled} aria-label={label} {...rest}>
      <span className="material-symbols-rounded" aria-hidden="true">{icon}</span>
    </button>
  );
}
