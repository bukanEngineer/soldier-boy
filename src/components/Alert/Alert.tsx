import React from "react";
import "./Alert.css";

export type AlertTone = "positive" | "critical" | "warning" | "info" | "neutral";

export type AlertProps = {
  /** Alert color tone */
  tone?: AlertTone;
  /** Alert title */
  title?: string;
  /** Alert body content */
  children?: React.ReactNode;
  /** Leading icon (Material Symbol name or ReactNode) */
  icon?: string | React.ReactNode;
  /** Dismiss handler (shows close button when provided) */
  onDismiss?: () => void;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Placement of actions */
  actionPlacement?: "bottom" | "inline";
  /** Additional CSS class names */
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const DEFAULT_ICONS: Record<AlertTone, string> = {
  positive: "check_circle",
  critical: "error",
  warning: "warning",
  info: "info",
  neutral: "info",
};

export function Alert({
  tone = "info",
  title,
  children,
  icon,
  onDismiss,
  actions,
  actionPlacement = "bottom",
  className = "",
  ...rest
}: AlertProps) {
  const resolvedIcon = icon === undefined ? DEFAULT_ICONS[tone] : icon;
  const cls = ["alert", `alert--${tone}`, className].filter(Boolean).join(" ");
  return (
    <div className={cls} role="alert" {...rest}>
      {resolvedIcon && (
        <span className="alert__icon" aria-hidden="true">
          {typeof resolvedIcon === "string" ? (
            <span className="material-symbols-rounded">{resolvedIcon}</span>
          ) : resolvedIcon}
        </span>
      )}
      <div className="alert__content">
        {title && <div className="alert__title">{title}</div>}
        {children && <div className="alert__body">{children}</div>}
        {actions && actionPlacement === "bottom" && (
          <div className="alert__actions">{actions}</div>
        )}
      </div>
      {actions && actionPlacement === "inline" && (
        <div className="alert__actions alert__actions--inline">{actions}</div>
      )}
      {onDismiss && (
        <button type="button" className="alert__close" aria-label="Dismiss" onClick={onDismiss}>
          <span className="material-symbols-rounded">close</span>
        </button>
      )}
    </div>
  );
}
