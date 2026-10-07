import React from "react";
import { cn } from "../../lib/cn";
import { ListItem } from "../List/List";
import { Tag } from "../Tag/Tag";
import { LinkButton } from "../LinkButton/LinkButton";
import "./ListBank.css";

export type ListBankVariant = "unverified" | "verified" | "rejected";

export type ListBankProps = Omit<React.ComponentProps<"div">, "children" | "title"> & {
  name?: React.ReactNode;
  account?: React.ReactNode;
  swift?: React.ReactNode;
  logo?: React.ReactNode;
  variant?: ListBankVariant;
  onAction?: () => void;
  actionLabel?: string;
};

/** Bank account row with verify / reject states. Built on `ListItem`. */
export function ListBank({
  name,
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
  const showSwift = isVerified && swift;
  const hasDetails = account || showSwift || isRejected;

  return (
    <ListItem
      className={cn("list-bank", className)}
      data-variant={variant}
      leading={logo != null ? <span className="list-bank__logo">{logo}</span> : undefined}
      title={name}
      description={
        hasDetails ? (
          <span className="list-bank__details">
            {account && <span>{account}</span>}
            {showSwift && <span>{swift}</span>}
            {isRejected && (
              <Tag tone="critical" className="list-bank__tag">
                Rejected
              </Tag>
            )}
          </span>
        ) : undefined
      }
      trailing={
        !isVerified ? (
          <LinkButton size="md" onClick={onAction}>
            {label}
          </LinkButton>
        ) : undefined
      }
      {...rest}
    />
  );
}
