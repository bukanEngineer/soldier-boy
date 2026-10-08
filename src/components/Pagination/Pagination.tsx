import React from "react";
import { cn } from "../../lib/cn";
import "./Pagination.css";
import { Icon } from "../Icon/Icon";

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}

/** Build a compact page list with ellipsis markers. */
export function buildPaginationPages(
  current: number,
  total: number,
  siblings = 1,
): (number | "ellipsis")[] {
  const totalShown = siblings * 2 + 5;
  if (total <= totalShown) return range(1, total);
  const left = Math.max(current - siblings, 2);
  const right = Math.min(current + siblings, total - 1);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < total - 1;
  const pages: (number | "ellipsis")[] = [1];
  if (showLeftEllipsis) pages.push("ellipsis");
  pages.push(...range(left, right));
  if (showRightEllipsis) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export type PaginationProps = React.ComponentProps<"nav">;

/** Root navigation landmark. Compose with parts, or use `PaginationNav` for page-aware UI. */
export function Pagination({
  className,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: PaginationProps) {
  return (
    <nav aria-label={ariaLabel} className={cn("pagination", className)} {...props} />
  );
}

export type PaginationContentProps = React.ComponentProps<"div">;

export function PaginationContent({ className, ...props }: PaginationContentProps) {
  return <div className={cn("pagination__content", className)} {...props} />;
}

export type PaginationItemProps = React.ComponentProps<"div">;

export function PaginationItem({ className, ...props }: PaginationItemProps) {
  return <div className={cn("pagination__item", className)} {...props} />;
}

export type PaginationLinkProps = React.ComponentProps<"button"> & {
  /** Marks the current page */
  isActive?: boolean;
};

export function PaginationLink({
  isActive = false,
  className,
  type = "button",
  ...props
}: PaginationLinkProps) {
  return (
    <button
      type={type}
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn("pagination__btn", className)}
      {...props}
    />
  );
}

export type PaginationPreviousProps = React.ComponentProps<"button">;

export function PaginationPrevious({
  className,
  type = "button",
  children,
  ...props
}: PaginationPreviousProps) {
  return (
    <button
      type={type}
      aria-label="Previous page"
      className={cn("pagination__btn", "pagination__prev", className)}
      {...props}
    >
      {children ?? (
        <Icon name="chevron_left" />
      )}
    </button>
  );
}

export type PaginationNextProps = React.ComponentProps<"button">;

export function PaginationNext({
  className,
  type = "button",
  children,
  ...props
}: PaginationNextProps) {
  return (
    <button
      type={type}
      aria-label="Next page"
      className={cn("pagination__btn", "pagination__next", className)}
      {...props}
    >
      {children ?? (
        <Icon name="chevron_right" />
      )}
    </button>
  );
}

export type PaginationEllipsisProps = React.ComponentProps<"span">;

export function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span className={cn("pagination__ellipsis", className)} {...props}>
      …
    </span>
  );
}

export type PaginationSummaryProps = React.ComponentProps<"span">;

export function PaginationSummary({ className, ...props }: PaginationSummaryProps) {
  return <span className={cn("pagination__summary", className)} {...props} />;
}

export type PaginationNavProps = Omit<PaginationProps, "children"> & {
  /** Current page (1-indexed) */
  page?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Number of sibling pages to show around the current page */
  siblings?: number;
  /** Show "X–Y of Z" summary */
  showSummary?: boolean;
  /** Total items (for summary display) */
  totalItems?: number;
  /** Items per page (for summary display) */
  pageSize?: number;
};

/**
 * Page-aware pagination recipe built on the compound parts.
 *
 *   <PaginationNav page={2} totalPages={12} onPageChange={setPage} />
 */
export function PaginationNav({
  page = 1,
  totalPages = 1,
  onPageChange,
  siblings = 1,
  showSummary = false,
  totalItems,
  pageSize,
  className,
  ...rest
}: PaginationNavProps) {
  const pages = buildPaginationPages(page, totalPages, siblings);
  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange?.(p);
  };

  return (
    <Pagination className={className} {...rest}>
      {showSummary && totalItems != null && pageSize != null && (
        <PaginationSummary>
          {Math.min((page - 1) * pageSize + 1, totalItems)}–
          {Math.min(page * pageSize, totalItems)} of {totalItems}
        </PaginationSummary>
      )}
      <PaginationContent>
        <PaginationPrevious disabled={page <= 1} onClick={() => go(page - 1)} />
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <PaginationEllipsis key={`e${i}`} />
          ) : (
            <PaginationLink key={p} isActive={p === page} onClick={() => go(p)}>
              {p}
            </PaginationLink>
          ),
        )}
        <PaginationNext disabled={page >= totalPages} onClick={() => go(page + 1)} />
      </PaginationContent>
    </Pagination>
  );
}
