import React from "react";
import { cn } from "../../lib/cn";
import "./Breadcrumb.css";
import { Icon, isIconName, type IconName } from "../Icon/Icon";

export type BreadcrumbProps = React.ComponentProps<"nav">;

/** Root navigation landmark for a breadcrumb trail. */
export function Breadcrumb({
  className,
  "aria-label": ariaLabel = "Breadcrumb",
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className={cn("breadcrumb", className)} {...props} />
  );
}

export type BreadcrumbListProps = React.ComponentProps<"ol">;

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return <ol className={cn("breadcrumb__list", className)} {...props} />;
}

export type BreadcrumbItemProps = React.ComponentProps<"li">;

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return <li className={cn("breadcrumb__item-wrap", className)} {...props} />;
}

export type BreadcrumbLinkProps = React.ComponentProps<"a">;

/** Interactive link segment. */
export function BreadcrumbLink({ className, ...props }: BreadcrumbLinkProps) {
  return <a className={cn("breadcrumb__item", className)} {...props} />;
}

export type BreadcrumbButtonProps = React.ComponentProps<"button">;

/** Interactive button segment (when there is no `href`). */
export function BreadcrumbButton({
  className,
  type = "button",
  ...props
}: BreadcrumbButtonProps) {
  return <button type={type} className={cn("breadcrumb__item", className)} {...props} />;
}

export type BreadcrumbPageProps = React.ComponentProps<"span">;

/** Current page (non-interactive). */
export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      data-current=""
      aria-current="page"
      className={cn("breadcrumb__item", className)}
      {...props}
    />
  );
}

export type BreadcrumbSeparatorProps = React.ComponentProps<"li"> & {
  /** Icon name from the vendored set (e.g. `"chevron_right"`); any other text is rendered as is. */
  children?: React.ReactNode;
};

export function BreadcrumbSeparator({
  children = "/",
  className,
  ...props
}: BreadcrumbSeparatorProps) {
  const isSymbol = typeof children === "string" && isIconName(children);
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("breadcrumb__sep", className)}
      {...props}
    >
      {isSymbol ? <Icon name={children as IconName} /> : children}
    </li>
  );
}

export type BreadcrumbEllipsisProps = React.ComponentProps<"span">;

export function BreadcrumbEllipsis({ className, ...props }: BreadcrumbEllipsisProps) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("breadcrumb__ellipsis", className)}
      {...props}
    >
      …
      <span className="sr-only">More</span>
    </span>
  );
}
