import React from "react";
import { cn } from "../../lib/cn";
import { ListItem } from "../List/List";
import { Tag } from "../Tag/Tag";
import { LinkButton } from "../LinkButton/LinkButton";
import "./ListBlockchain.css";

export type ListBlockchainVariant =
  | "verifiedPrivateWallet"
  | "verifiedCustodial"
  | "pending"
  | "verify";

export type ListBlockchainProps = Omit<React.ComponentProps<"div">, "children" | "title"> & {
  name?: React.ReactNode;
  address?: React.ReactNode;
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: ListBlockchainVariant;
  onAction?: () => void;
  actionLabel?: string;
};

/** Same rule as `Copybox` `truncate`: keep the first 10 and last 8 characters. */
const TRUNCATE_OVER = 20;

function Address({ value }: { value: React.ReactNode }) {
  if (typeof value !== "string" || value.length <= TRUNCATE_OVER) return <>{value}</>;
  return (
    <span className="list-blockchain__address" title={value}>
      {/* Screen readers get the full address, not the two visible ends */}
      <span className="list-blockchain__sr">{value}</span>
      <span className="list-blockchain__trunc" aria-hidden="true">
        <span className="list-blockchain__trunc-start">{value.slice(0, 10)}</span>
        <span className="list-blockchain__trunc-fixed">…</span>
        <span className="list-blockchain__trunc-fixed">{value.slice(-8)}</span>
      </span>
    </span>
  );
}

/** Blockchain wallet row with pending / verify states. Built on `ListItem`. */
export function ListBlockchain({
  name,
  address,
  meta,
  icon,
  variant = "verifiedPrivateWallet",
  onAction,
  actionLabel = "Verify",
  className,
  ...rest
}: ListBlockchainProps) {
  const isPending = variant === "pending";
  const isVerify = variant === "verify";

  let trailing: React.ReactNode;
  if (isPending) {
    trailing = <Tag tone="warning">Pending</Tag>;
  } else if (isVerify) {
    trailing = (
      <LinkButton size="md" onClick={onAction}>
        {actionLabel}
      </LinkButton>
    );
  }

  return (
    <ListItem
      className={cn("list-blockchain", className)}
      data-variant={variant}
      leading={icon != null ? <span className="list-blockchain__icon">{icon}</span> : undefined}
      title={name}
      description={
        address || meta ? (
          <span className="list-blockchain__details">
            {address && (
              <span className="list-blockchain__line">
                <Address value={address} />
              </span>
            )}
            {meta && <span className="list-blockchain__line">{meta}</span>}
          </span>
        ) : undefined
      }
      trailing={trailing}
      {...rest}
    />
  );
}
