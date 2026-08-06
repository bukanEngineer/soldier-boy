import React, { useState } from "react";
import "./Pagination.css";

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}

function buildPages(current: number, total: number, siblings = 1): (number | string)[] {
  const totalShown = siblings * 2 + 5;
  if (total <= totalShown) return range(1, total);
  const left = Math.max(current - siblings, 2);
  const right = Math.min(current + siblings, total - 1);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < total - 1;
  const pages: (number | string)[] = [1];
  if (showLeftEllipsis) pages.push("…");
  pages.push(...range(left, right));
  if (showRightEllipsis) pages.push("…");
  pages.push(total);
  return pages;
}

export type PaginationProps = {
  /** Current page (1-indexed) */
  page?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Page change handler */
  onChange?: (page: number) => void;
  /** Number of sibling pages to show */
  siblings?: number;
  /** Show "Page X of Y" summary */
  showSummary?: boolean;
  /** Total items (for summary display) */
  totalItems?: number;
  /** Items per page (for summary display) */
  pageSize?: number;
  /** Additional CSS class names */
  className?: string;
};

export function Pagination({
  page = 1,
  totalPages = 1,
  onChange,
  siblings = 1,
  showSummary = false,
  totalItems,
  pageSize,
  className = "",
}: PaginationProps) {
  const pages = buildPages(page, totalPages, siblings);
  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange && onChange(p);
  };

  return (
    <nav className={"pagination " + className} aria-label="Pagination">
      {showSummary && totalItems != null && pageSize != null && (
        <span className="pagination__summary">
          {Math.min((page - 1) * pageSize + 1, totalItems)}–{Math.min(page * pageSize, totalItems)} of {totalItems}
        </span>
      )}
      <button
        type="button"
        className="pagination__btn pagination__prev"
        disabled={page <= 1}
        aria-label="Previous page"
        onClick={() => go(page - 1)}
      >
        <span className="material-symbols-rounded">chevron_left</span>
      </button>
      {pages.map((p, i) =>
        typeof p === "string" ? (
          <span key={`e${i}`} className="pagination__ellipsis">{p}</span>
        ) : (
          <button
            key={p}
            type="button"
            className={"pagination__btn" + (p === page ? " is-active" : "")}
            aria-current={p === page ? "page" : undefined}
            onClick={() => go(p)}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        className="pagination__btn pagination__next"
        disabled={page >= totalPages}
        aria-label="Next page"
        onClick={() => go(page + 1)}
      >
        <span className="material-symbols-rounded">chevron_right</span>
      </button>
    </nav>
  );
}
