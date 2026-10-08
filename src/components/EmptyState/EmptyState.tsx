import React from "react";
import { cn } from "../../lib/cn";
import "./EmptyState.css";

export type EmptyStateProps = React.ComponentProps<"div"> & {
  /** Illustration above the title — prefer `<EmptyStateMedia>` as a child */
  media?: React.ReactNode;
  /** Heading text — prefer `<EmptyStateTitle>` as a child */
  title?: React.ReactNode;
  /** Subtext — prefer `<EmptyStateDescription>` as a child */
  description?: React.ReactNode;
  /** Compact padding */
  compact?: boolean;
};

export type EmptyStateMediaProps = React.ComponentProps<"div">;

/** Decorative slot for an illustration (e.g. from `stxdesign-sandbox/illustrations`). */
export function EmptyStateMedia({ className, ...props }: EmptyStateMediaProps) {
  return <div className={cn("empty__media", className)} {...props} />;
}

export type EmptyStateTitleProps = React.ComponentProps<"div">;

export function EmptyStateTitle({ className, ...props }: EmptyStateTitleProps) {
  return <div className={cn("empty__title", className)} {...props} />;
}

export type EmptyStateDescriptionProps = React.ComponentProps<"div">;

export function EmptyStateDescription({ className, ...props }: EmptyStateDescriptionProps) {
  return <div className={cn("empty__sub", className)} {...props} />;
}

/**
 * Empty / zero-data placeholder.
 *
 *   <EmptyState>
 *     <EmptyStateMedia><DocumentWithMagnifierIllustration /></EmptyStateMedia>
 *     <EmptyStateTitle>No transactions</EmptyStateTitle>
 *     <EmptyStateDescription>Transfers will show up here.</EmptyStateDescription>
 *   </EmptyState>
 */
export function EmptyState({
  media,
  title,
  description,
  compact = false,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn("empty", className)} data-compact={compact || undefined} {...props}>
      {media != null && <EmptyStateMedia>{media}</EmptyStateMedia>}
      {title != null && <EmptyStateTitle>{title}</EmptyStateTitle>}
      {description != null && <EmptyStateDescription>{description}</EmptyStateDescription>}
      {children}
    </div>
  );
}
