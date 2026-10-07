import React from "react";
import { cn } from "../../lib/cn";
import { Tag } from "../Tag/Tag";
import { LinkButton } from "../LinkButton/LinkButton";
import "./ListBank.css";

export type ListBankVariant = "unverified" | "verified" | "rejected";

export type ListBankProps = Omit<React.ComponentProps<"div">, "children"> & {
  name?: React.ReactNode;
  account?: React.ReactNode;
  swift?: React.ReactNode;
  logo?: React.ReactNode;
  variant?: ListBankVariant;
  onAction?: () => void;
  actionLabel?: string;
};

/** Bank account row with verify / reject states. */
export function ListBank({
  name = "John Doe",
  account,
  swift,
  logo,
  variant = "unverified",
  onAction,
  actionLabel,
  className,
  ...rest
}: ListBankProps) {
  const isVerified = variant === "verified";
  const isRejected = variant === "rejected";
  const label = actionLabel || (isRejected ? "Resubmit" : "Verify");

  return (
    <div className={cn("list-bank", className)} data-variant={variant} {...rest}>
      <div className="list-bank__main">
        {logo != null && <span className="list-bank__logo">{logo}</span>}
        <div className="list-bank__text">
          <span className="list-bank__name">{name}</span>
          {account && <span className="list-bank__sub">{account}</span>}
          {isVerified && swift && <span className="list-bank__sub">{swift}</span>}
          {isRejected && (
            <Tag tone="critical" className="list-bank__tag">
              Rejected
            </Tag>
          )}
        </div>
      </div>
      {!isVerified && (
        <LinkButton size="md" onClick={onAction}>
          {label}
        </LinkButton>
      )}
    </div>
  );
}
