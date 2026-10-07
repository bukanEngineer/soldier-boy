import React from "react";
import { cn } from "../../lib/cn";
import { Tag } from "../Tag/Tag";
import "./ListBlockchain.css";

export type ListBlockchainVariant =
  | "verifiedPrivateWallet"
  | "verifiedCustodial"
  | "pending"
  | "verify";

export type ListBlockchainProps = Omit<React.ComponentProps<"div">, "children"> & {
  name?: React.ReactNode;
  address?: React.ReactNode;
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: ListBlockchainVariant;
  onAction?: () => void;
  actionLabel?: string;
};

/** Blockchain wallet row with pending / verify states. */
export function ListBlockchain({
  name = "Wallet",
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

  return (
    <div className={cn("list-blockchain", className)} data-variant={variant} {...rest}>
      <div className="list-blockchain__main">
        {icon != null && <span className="list-blockchain__icon">{icon}</span>}
        <div className="list-blockchain__text">
          <span className="list-blockchain__name">{name}</span>
          {address && <span className="list-blockchain__sub">{address}</span>}
          {meta && <span className="list-blockchain__sub">{meta}</span>}
        </div>
      </div>

      {isPending && (
        <Tag tone="warning" className="list-blockchain__tag">
          Pending
        </Tag>
      )}

      {isVerify && (
        <button type="button" className="list-blockchain__link" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
