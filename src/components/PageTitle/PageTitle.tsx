import React, { forwardRef } from "react";
import "./PageTitle.css";

export type PageTitleProps = {
  /** Page heading — can be a string or ReactNode for inline elements like asset marks */
  title: React.ReactNode;
  /** Subtitle text */
  subtitle?: string;
  /** Breadcrumb element */
  breadcrumb?: React.ReactNode;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "title">;

export const PageTitle = forwardRef<HTMLDivElement, PageTitleProps>(
  ({ title, subtitle, breadcrumb, actions, className, ...rest }, ref) => {
    return (
      <header
        ref={ref}
        className={`page-title${className ? ` ${className}` : ""}`}
        {...rest}
      >
        <div className="page-title__head">
          {breadcrumb}
          <h1 className="page-title__h1">{title}</h1>
          {subtitle && <p className="page-title__sub">{subtitle}</p>}
        </div>
        {actions && (
          <div className="page-title__actions" role="group" aria-label="Page actions">
            {actions}
          </div>
        )}
      </header>
    );
  }
);

PageTitle.displayName = "PageTitle";
