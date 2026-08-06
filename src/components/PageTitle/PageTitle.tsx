import React from "react";
import "./PageTitle.css";

export type PageTitleProps = {
  /** Page heading */
  title: string;
  /** Subtitle text */
  subtitle?: string;
  /** Breadcrumb element */
  breadcrumb?: React.ReactNode;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
};

export function PageTitle({ title, subtitle, breadcrumb, actions, className = "" }: PageTitleProps) {
  return (
    <div className={"page-title " + className}>
      <div className="page-title__head">
        {breadcrumb}
        <h1 className="page-title__h1">{title}</h1>
        {subtitle && <p className="page-title__sub">{subtitle}</p>}
      </div>
      {actions && <div className="page-title__actions">{actions}</div>}
    </div>
  );
}
