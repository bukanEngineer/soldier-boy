import React from "react";
import { cn } from "../../lib/cn";
import "./EmptyState.css";

export type EmptyStateProps = React.ComponentProps<"div"> & {
  /** Heading text — prefer `<EmptyStateTitle>` as a child */
  title?: React.ReactNode;
  /** Subtext — prefer `<EmptyStateDescription>` as a child */
  description?: React.ReactNode;
  /** Compact padding */
  compact?: boolean;
};

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
 *     <EmptyStateTitle>No transactions</EmptyStateTitle>
 *     <EmptyStateDescription>Transfers will show up here.</EmptyStateDescription>
 *   </EmptyState>
 */
export function EmptyState({
  title,
  description,
  compact = false,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn("empty", className)} data-compact={compact || undefined} {...props}>
      {title != null && <EmptyStateTitle>{title}</EmptyStateTitle>}
      {description != null && <EmptyStateDescription>{description}</EmptyStateDescription>}
      {children}
    </div>
  );
}
