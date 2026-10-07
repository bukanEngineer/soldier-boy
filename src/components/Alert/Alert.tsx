import React from "react";
import { cn } from "../../lib/cn";
import "./Alert.css";

export type AlertTone = "positive" | "critical" | "warning" | "info" | "neutral";

export type AlertProps = React.ComponentProps<"div"> & {
  /** Alert color tone */
  tone?: AlertTone;
  /**
   * Alert title. Prefer composing `<AlertTitle>` as a child for richer content.
   */
  title?: React.ReactNode;
  /** Leading icon (Material Symbol name or ReactNode). Pass `null` to hide. */
  icon?: string | React.ReactNode | null;
  /** Dismiss handler (shows close button when provided) */
  onDismiss?: () => void;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Placement of actions */
  actionPlacement?: "bottom" | "inline";
};

const DEFAULT_ICONS: Record<AlertTone, string> = {
  positive: "check_circle",
  critical: "error",
  warning: "warning",
  info: "info",
  neutral: "info",
};

export type AlertTitleProps = React.ComponentProps<"div">;

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return <div className={cn("alert__title", className)} {...props} />;
}

export type AlertDescriptionProps = React.ComponentProps<"div">;

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return <div className={cn("alert__body", className)} {...props} />;
}

export type AlertActionsProps = React.ComponentProps<"div"> & {
  placement?: "bottom" | "inline";
};

export function AlertActions({
  placement = "bottom",
  className,
  ...props
}: AlertActionsProps) {
  return (
    <div
      data-placement={placement}
      className={cn("alert__actions", placement === "inline" && "alert__actions--inline", className)}
      {...props}
    />
  );
}

/**
 * Inline status banner. Compose with parts or use `title` / `actions` shortcuts:
 *
 *   <Alert tone="critical">
 *     <AlertTitle>Transfer failed</AlertTitle>
 *     <AlertDescription>Please try again.</AlertDescription>
 *   </Alert>
 */
export function Alert({
  tone = "info",
  title,
  children,
  icon,
  onDismiss,
  actions,
  actionPlacement = "bottom",
  className,
  ...rest
}: AlertProps) {
  const resolvedIcon = icon === undefined ? DEFAULT_ICONS[tone] : icon;

  return (
    <div
      role="alert"
      data-tone={tone}
      className={cn("alert", `alert--${tone}`, className)}
      {...rest}
    >
      {resolvedIcon != null && resolvedIcon !== false && (
        <span className="alert__icon" aria-hidden="true">
          {typeof resolvedIcon === "string" ? (
            <span className="material-symbols-rounded">{resolvedIcon}</span>
          ) : (
            resolvedIcon
          )}
        </span>
      )}
      <div className="alert__content">
        {title != null && <AlertTitle>{title}</AlertTitle>}
        {children != null &&
          (typeof children === "string" || typeof children === "number" ? (
            <AlertDescription>{children}</AlertDescription>
          ) : (
            children
          ))}
        {actions && actionPlacement === "bottom" && (
          <AlertActions placement="bottom">{actions}</AlertActions>
        )}
      </div>
      {actions && actionPlacement === "inline" && (
        <AlertActions placement="inline">{actions}</AlertActions>
      )}
      {onDismiss && (
        <button type="button" className="alert__close" aria-label="Dismiss" onClick={onDismiss}>
          <span className="material-symbols-rounded" aria-hidden="true">
            close
          </span>
        </button>
      )}
    </div>
  );
}
