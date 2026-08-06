import React from "react";
import "./EmptyState.css";

export type EmptyStateProps = {
  /** Heading text */
  title?: string;
  /** Subtext */
  sub?: string;
  /** Compact mode */
  compact?: boolean;
  /** Additional CSS class names */
  className?: string;
};

export function EmptyState({ title, sub, compact = false, className = "" }: EmptyStateProps) {
  const cls = ["empty", compact && "is-compact", className].filter(Boolean).join(" ");
  return (
    <div className={cls}>
      {title && <div className="empty__title">{title}</div>}
      {sub && <div className="empty__sub">{sub}</div>}
    </div>
  );
}
