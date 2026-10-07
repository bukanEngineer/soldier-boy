import React from "react";
import { cn } from "../../lib/cn";
import "./Table.css";

export type TableWrapProps = React.ComponentProps<"div">;

/** Scroll container around a table. Focusable so keyboard users can scroll overflow. */
export function TableWrap({ className, tabIndex = 0, ...props }: TableWrapProps) {
  return <div className={cn("table-wrap", className)} tabIndex={tabIndex} {...props} />;
}

export type TableProps = React.ComponentProps<"table"> & {
  /** Alternating row backgrounds */
  zebra?: boolean;
};

/** Bare `<table>` element. Compose with Header / Body / Row / Head / Cell. */
export function Table({ zebra = false, className, ...props }: TableProps) {
  return (
    <table className={cn("table", zebra && "table--zebra", className)} data-zebra={zebra || undefined} {...props} />
  );
}

export type TableHeaderProps = React.ComponentProps<"thead">;
export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead className={cn("table__header", className)} {...props} />;
}

export type TableBodyProps = React.ComponentProps<"tbody">;
export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn("table__body", className)} {...props} />;
}

export type TableFooterProps = React.ComponentProps<"tfoot">;
export function TableFooter({ className, ...props }: TableFooterProps) {
  return <tfoot className={cn("table__footer", className)} {...props} />;
}

export type TableRowProps = React.ComponentProps<"tr">;
export function TableRow({ className, ...props }: TableRowProps) {
  return <tr className={cn("table__row", className)} {...props} />;
}

export type TableHeadProps = React.ComponentProps<"th">;
export function TableHead({ className, ...props }: TableHeadProps) {
  return <th className={cn("table__head", className)} {...props} />;
}

export type TableCellProps = React.ComponentProps<"td">;
export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cn("table__cell", className)} {...props} />;
}

export type TableCaptionProps = React.ComponentProps<"caption">;
export function TableCaption({ className, ...props }: TableCaptionProps) {
  return <caption className={cn("table__caption", className)} {...props} />;
}
