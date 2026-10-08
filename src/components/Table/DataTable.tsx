import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Popover } from "../Popover/Popover";
import { cn } from "../../lib/cn";
import { resolveZone, describeZone, formatDateInZone } from "../../lib/timezone";
import {
  Table,
  TableWrap,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";
import "./Table.css";
import { Icon } from "../Icon/Icon";

export type DataTableSort = { key: string; direction: "asc" | "desc" } | null;

export type DataTableColumn<Row = Record<string, unknown>> = {
  key: string;
  header?: React.ReactNode;
  width?: string | number;
  align?: "left" | "right";
  numeric?: boolean;
  sortable?: boolean;
  fixed?: "left" | "right";
  date?: boolean;
  dateFormat?: Intl.DateTimeFormatOptions;
  tooltip?: string | { title?: React.ReactNode; content?: React.ReactNode };
  render?: (row: Row) => React.ReactNode;
  onClick?: (row: Row, key: string) => void;
};

export type DataTableProps<Row extends Record<string, unknown> = Record<string, unknown>> = {
  columns?: DataTableColumn<Row>[];
  rows?: Row[];
  rowKey?: string;
  zebra?: boolean;
  empty?: React.ReactNode;
  className?: string;
  scrollX?: string | number;
  scrollY?: string | number;
  sort?: DataTableSort;
  defaultSort?: DataTableSort;
  onSortChange?: (sort: DataTableSort) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  endLabel?: React.ReactNode;
  showTimezone?: boolean;
  timezone?: string;
};

/**
 * Data-driven table recipe on top of the compound `Table` parts.
 * Prefer composing `Table` / `TableHeader` / `TableRow` / … directly for
 * custom layouts.
 */
export function DataTable<Row extends Record<string, unknown> = Record<string, unknown>>({
  columns = [],
  rows = [],
  rowKey = "id",
  zebra = false,
  empty = "No data.",
  className = "",
  scrollX,
  scrollY,
  sort,
  defaultSort = null,
  onSortChange,
  onLoadMore,
  hasMore = false,
  loading = false,
  loadingLabel = "Loading more…",
  endLabel,
  showTimezone = false,
  timezone,
}: DataTableProps<Row>) {
  const [internalSort, setInternalSort] = useState<DataTableSort>(defaultSort);
  const activeSort = sort !== undefined ? sort : internalSort;

  const toggleSort = (col: DataTableColumn<Row>) => {
    if (!col.sortable) return;
    let next: DataTableSort;
    if (!activeSort || activeSort.key !== col.key) next = { key: col.key, direction: "asc" };
    else if (activeSort.direction === "asc") next = { key: col.key, direction: "desc" };
    else next = null;

    if (sort === undefined) setInternalSort(next);
    onSortChange?.(next);
  };

  const hasFixed = columns.some((c) => c.fixed === "left" || c.fixed === "right");
  const wrapRef = useRef<HTMLDivElement>(null);
  const headRowRef = useRef<HTMLTableRowElement>(null);
  const [offsets, setOffsets] = useState<Record<string, { left?: number; right?: number }>>({});
  const [ping, setPing] = useState({ left: false, right: false });

  useLayoutEffect(() => {
    if (!hasFixed) return undefined;
    const measure = () => {
      const wrap = wrapRef.current;
      const ths = headRowRef.current ? Array.from(headRowRef.current.children) as HTMLElement[] : [];
      const next: Record<string, { left?: number; right?: number }> = {};

      let leftAcc = 0;
      columns.forEach((c, i) => {
        if (c.fixed === "left") {
          next[c.key] = { left: leftAcc };
          leftAcc += ths[i]?.offsetWidth || 0;
        }
      });

      let rightAcc = 0;
      for (let i = columns.length - 1; i >= 0; i--) {
        const c = columns[i];
        if (c.fixed === "right") {
          next[c.key] = { ...(next[c.key] || {}), right: rightAcc };
          rightAcc += ths[i]?.offsetWidth || 0;
        }
      }
      setOffsets(next);

      if (wrap) {
        setPing({
          left: wrap.scrollLeft > 0,
          right: wrap.scrollLeft + wrap.clientWidth < wrap.scrollWidth - 1,
        });
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [columns, rows, hasFixed]);

  const infinite = typeof onLoadMore === "function";
  const sentinelRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (!infinite || !hasMore || loading) return undefined;
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onLoadMore?.();
      },
      { root: scrollY ? wrapRef.current : null, rootMargin: "120px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [infinite, hasMore, loading, scrollY, rows.length, onLoadMore]);

  const lastLeftKey = columns.filter((c) => c.fixed === "left").pop()?.key;
  const firstRightKey = columns.find((c) => c.fixed === "right")?.key;

  const zone = useMemo(() => resolveZone(timezone), [timezone]);
  const zoneInfo = useMemo(() => describeZone(zone), [zone]);
  const zoneLabel = [zoneInfo.city, zoneInfo.abbrev, zoneInfo.offset].filter(Boolean).join(", ");

  const cellContent = (c: DataTableColumn<Row>, row: Row): React.ReactNode => {
    if (c.render) return c.render(row);
    const value = row[c.key];
    if (showTimezone && c.date && value != null && value !== "") {
      return formatDateInZone(value, zone, c.dateFormat) as React.ReactNode;
    }
    return value as React.ReactNode;
  };

  const headerTooltip = (c: DataTableColumn<Row>) => {
    let title: React.ReactNode | undefined;
    let content: React.ReactNode | undefined;
    if (c.tooltip) {
      if (typeof c.tooltip === "string") content = c.tooltip;
      else ({ title, content } = c.tooltip);
    }
    const tz = showTimezone && c.date ? zoneLabel : null;
    if (!title && !content && !tz) return null;
    return {
      title,
      content: (
        <>
          {content && <span>{content}</span>}
          {tz && <span className="table__th-tz">Times shown in {tz}</span>}
        </>
      ),
    };
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasFixed) return;
    const el = e.currentTarget;
    setPing({
      left: el.scrollLeft > 0,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    });
  };

  const cellStyle = (c: DataTableColumn<Row>): React.CSSProperties => {
    const style: React.CSSProperties = {};
    if (c.width) style.width = c.width;
    const offset = offsets[c.key];
    if (c.fixed === "left" && offset) style.left = offset.left;
    if (c.fixed === "right" && offset) style.right = offset.right;
    return style;
  };

  const cellClass = (c: DataTableColumn<Row>) =>
    cn(
      (c.numeric || c.align === "right") && "table__num",
      c.fixed === "left" && "table__cell--fixed-left",
      c.fixed === "left" && c.key === lastLeftKey && ping.left && "table__cell--fixed-shadow",
      c.fixed === "right" && "table__cell--fixed-right",
      c.fixed === "right" && c.key === firstRightKey && ping.right && "table__cell--fixed-shadow",
    ) || undefined;

  return (
    <TableWrap
      className={className}
      ref={wrapRef}
      onScroll={handleScroll}
      style={scrollY ? { maxHeight: scrollY, overflowY: "auto" } : undefined}
    >
      <Table zebra={zebra} style={scrollX ? { minWidth: scrollX } : undefined}>
        <TableHeader>
          <TableRow ref={headRowRef}>
            {columns.map((c) => {
              const isSorted = Boolean(c.sortable && activeSort?.key === c.key);
              const direction = isSorted ? activeSort!.direction : undefined;
              const tt = headerTooltip(c);
              return (
                <TableHead
                  key={c.key}
                  className={cellClass(c)}
                  style={cellStyle(c)}
                  aria-sort={
                    c.sortable
                      ? direction === "asc"
                        ? "ascending"
                        : direction === "desc"
                          ? "descending"
                          : "none"
                      : undefined
                  }
                >
                  <span className="table__th-inner">
                    {tt && (
                      <Popover.Root>
                        <Popover.Trigger
                          className="table__th-info"
                          aria-label={(tt.title ? String(tt.title) + ". " : "") + "More information"}
                        >
                          <Icon name="info" />
                        </Popover.Trigger>
                        <Popover.Popup side="top">
                          {tt.title && (
                            <Popover.Header>
                              <Popover.Title>{tt.title}</Popover.Title>
                            </Popover.Header>
                          )}
                          {tt.content && (
                            <Popover.Description>{tt.content}</Popover.Description>
                          )}
                        </Popover.Popup>
                      </Popover.Root>
                    )}
                    {c.sortable ? (
                      <button type="button" className="table__sort-btn" onClick={() => toggleSort(c)}>
                        <span>{c.header}</span>
                        <Icon
                          name={
                            direction === "asc"
                              ? "arrow_upward"
                              : direction === "desc"
                                ? "arrow_downward"
                                : "unfold_more"
                          }
                          className="table__sort-icon"
                          data-active={isSorted || undefined}
                        />
                      </button>
                    ) : (
                      c.header
                    )}
                  </span>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell className="table__empty" colSpan={columns.length}>
                {empty}
              </TableCell>
            </TableRow>
          )}
          {rows.map((row, i) => (
            <TableRow key={String(row[rowKey] ?? i)}>
              {columns.map((c) => (
                <TableCell
                  key={c.key}
                  className={cn(cellClass(c), c.onClick && "table__cell--clickable")}
                  style={cellStyle(c)}
                  onClick={c.onClick ? () => c.onClick?.(row, c.key) : undefined}
                  role={c.onClick ? "button" : undefined}
                  tabIndex={c.onClick ? 0 : undefined}
                  onKeyDown={
                    c.onClick
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            c.onClick?.(row, c.key);
                          }
                        }
                      : undefined
                  }
                >
                  {cellContent(c, row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {infinite && rows.length > 0 && (
            <TableRow ref={sentinelRef} aria-hidden={!loading}>
              <TableCell className="table__status" colSpan={columns.length}>
                {loading ? (
                  <span className="table__loading">
                    <span className="table__spinner" aria-hidden="true" />
                    {loadingLabel}
                  </span>
                ) : !hasMore && endLabel ? (
                  endLabel
                ) : null}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableWrap>
  );
}
