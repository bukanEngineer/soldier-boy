import React from "react";
import { buttonClasses, type ButtonVariant, type ButtonSize } from "./styles";
import "./Button.css";

export type ButtonProps = {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button height */
  size?: ButtonSize;
  /** Disables interaction */
  disabled?: boolean;
  /** HTML button type attribute */
  type?: "button" | "submit" | "reset";
  /** Additional CSS class names */
  className?: string;
  /** Button content */
  children?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export function Button({
  variant = "primary",
  size = "lg",
  disabled = false,
  type = "button",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    buttonClasses.root,
    buttonClasses.variant[variant],
    buttonClasses.size[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type={type} className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
