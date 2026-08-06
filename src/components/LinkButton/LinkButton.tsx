import React from "react";
import { linkButtonClasses, type LinkButtonSize } from "./styles";
import "./LinkButton.css";

export type LinkButtonProps = {
  /** Render as a different element (e.g., "a" for links) */
  as?: React.ElementType;
  /** Button size */
  size?: LinkButtonSize;
  /** Use on dark backgrounds */
  onDark?: boolean;
  /** Material Symbol name for trailing icon */
  trailingIcon?: string;
  /** Material Symbol name for leading icon */
  leadingIcon?: string;
  /** Disables interaction (only applies when rendered as button) */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Button content */
  children?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export function LinkButton({
  as: Tag = "button",
  size = "md",
  onDark = false,
  trailingIcon,
  leadingIcon,
  disabled = false,
  className = "",
  children,
  ...rest
}: LinkButtonProps) {
  const cls = [
    linkButtonClasses.root,
    linkButtonClasses.size[size],
    onDark && linkButtonClasses.onDark,
    className,
  ].filter(Boolean).join(" ");
  const props = Tag === "button" ? { type: "button" as const, disabled } : {};
  return (
    <Tag className={cls} {...props} {...rest}>
      {leadingIcon && <span className="material-symbols-rounded">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className="material-symbols-rounded">{trailingIcon}</span>}
    </Tag>
  );
}
