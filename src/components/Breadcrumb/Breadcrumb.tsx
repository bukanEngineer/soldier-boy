import React from "react";
import "./Breadcrumb.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export type BreadcrumbProps = {
  /** Breadcrumb items */
  items?: BreadcrumbItem[];
  /** Separator character or Material Symbol name */
  separator?: string;
  /** Additional CSS class names */
  className?: string;
};

export function Breadcrumb({ items = [], separator = "/", className = "" }: BreadcrumbProps) {
  const isSymbol = typeof separator === "string" && /^[a-z_]+$/.test(separator);
  const sepCls = "breadcrumb__sep" + (isSymbol ? " material-symbols-rounded" : "");
  return (
    <nav aria-label="Breadcrumb" className={"breadcrumb " + className}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const cls = "breadcrumb__item" + (isLast ? " is-current" : "");
        return (
          <React.Fragment key={i}>
            {isLast ? (
              <span className={cls} aria-current="page">{item.label}</span>
            ) : item.href ? (
              <a className={cls} href={item.href} onClick={item.onClick}>{item.label}</a>
            ) : (
              <button type="button" className={cls} onClick={item.onClick}>{item.label}</button>
            )}
            {!isLast && (
              <span className={sepCls} aria-hidden="true">{separator}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
