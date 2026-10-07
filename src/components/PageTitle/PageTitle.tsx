import React from "react";
import { cn } from "../../lib/cn";
import "./PageTitle.css";

export type PageTitleProps = Omit<React.ComponentProps<"header">, "title"> & {
  /** Page heading — string or ReactNode (e.g. asset mark + name) */
  title: React.ReactNode;
  /** Subtitle text */
  subtitle?: React.ReactNode;
  /** Breadcrumb element */
  breadcrumb?: React.ReactNode;
  /** Action buttons */
  actions?: React.ReactNode;
};

/**
 * Page header with optional breadcrumb, subtitle and action cluster.
 *
 *   <PageTitle
 *     title="Transfers"
 *     subtitle="Last 30 days"
 *     actions={<Button>Export</Button>}
 *   />
 */
export function PageTitle({
  title,
  subtitle,
  breadcrumb,
  actions,
  className,
  ref,
  ...rest
}: PageTitleProps) {
  return (
    <header ref={ref} className={cn("page-title", className)} {...rest}>
      <div className="page-title__head">
        {breadcrumb}
        <h1 className="page-title__h1">{title}</h1>
        {subtitle != null && <p className="page-title__sub">{subtitle}</p>}
      </div>
      {actions != null && (
        <div className="page-title__actions" role="group" aria-label="Page actions">
          {actions}
        </div>
      )}
    </header>
  );
}
