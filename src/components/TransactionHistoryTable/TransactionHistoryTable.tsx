import React from "react";
import { DataTable, type DataTableColumn } from "../Table/DataTable";
import { Tag } from "../Tag/Tag";
import type { TagTone } from "../Tag/styles";
import { cn } from "../../lib/cn";
import "./TransactionHistoryTable.css";

const STATUS_TONE: Record<string, TagTone> = {
  completed: "positive",
  pending: "warning",
  processing: "info",
  cancelled: "critical",
  failed: "critical",
};

type StatusValue = string | { label: string; tone?: TagTone };

function statusTag(status?: StatusValue) {
  if (!status) return null;
  const label = typeof status === "string" ? status : status.label;
  const tone =
    (typeof status === "object" && status.tone) ||
    STATUS_TONE[String(label).toLowerCase()] ||
    "neutral";
  return <Tag tone={tone}>{label}</Tag>;
}

function num(key: string) {
  return function Num(row: Record<string, unknown>) {
    return <span className="txn__num">{row[key] as React.ReactNode}</span>;
  };
}

type Row = Record<string, unknown>;

const COLUMNS: Record<string, DataTableColumn<Row>[]> = {
  funding: [
    {
      key: "id",
      header: "Transaction ID",
      render: (r) => <span className="txn__id">{r.id as React.ReactNode}</span>,
    },
    { key: "date", header: "Transaction Date" },
    { key: "amount", header: "Amount", numeric: true, render: num("amount") },
    { key: "network", header: "Network" },
    {
      key: "wallet",
      header: "Wallet Address",
      render: (r) => (
        <span className="txn__num txn__truncate">{r.wallet as React.ReactNode}</span>
      ),
    },
    { key: "status", header: "Status", render: (r) => statusTag(r.status as StatusValue) },
  ],
  otc: [
    {
      key: "id",
      header: "Transaction ID",
      render: (r) => <span className="txn__id">{r.id as React.ReactNode}</span>,
    },
    { key: "date", header: "Transaction Date" },
    { key: "amountToBuy", header: "Amount to buy", numeric: true, render: num("amountToBuy") },
    { key: "amountToSell", header: "Amount to sell", numeric: true, render: num("amountToSell") },
    { key: "pair", header: "Pair", render: num("pair") },
    { key: "rate", header: "Rate", numeric: true, render: num("rate") },
    { key: "status", header: "Status", render: (r) => statusTag(r.status as StatusValue) },
  ],
  swap: [
    {
      key: "id",
      header: "Transaction ID",
      render: (r) => <span className="txn__id">{r.id as React.ReactNode}</span>,
    },
    { key: "date", header: "Created Date" },
    { key: "details", header: "Details" },
    { key: "pair", header: "Pair", render: num("pair") },
    { key: "sell", header: "Sell", numeric: true, render: num("sell") },
    { key: "buy", header: "Buy", numeric: true, render: num("buy") },
    { key: "price", header: "Price", numeric: true, render: num("price") },
    { key: "fee", header: "Fee", numeric: true, render: num("fee") },
    { key: "status", header: "Status", render: (r) => statusTag(r.status as StatusValue) },
  ],
};

export type TransactionHistoryType = "funding" | "otc" | "swap";

export type TransactionHistoryTableProps = {
  type?: TransactionHistoryType;
  rows?: Row[];
  empty?: React.ReactNode;
  className?: string;
};

export function TransactionHistoryTable({
  type = "funding",
  rows = [],
  empty = "No transactions yet.",
  className,
}: TransactionHistoryTableProps) {
  const columns = COLUMNS[type] || COLUMNS.funding;
  return (
    <DataTable columns={columns} rows={rows} empty={empty} className={cn("txn", className)} />
  );
}
