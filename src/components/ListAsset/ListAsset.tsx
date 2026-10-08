import React from "react";
import { ListItem } from "../List/List";
import { IconButton } from "../IconButton/IconButton";
import { ListSupportedNetwork } from "../ListSupportedNetwork/ListSupportedNetwork";
import { cn } from "../../lib/cn";
import "./ListAsset.css";
import { Icon } from "../Icon/Icon";

export type ListAssetVariant = "stablecoin" | "fiat" | string;
export type ListAssetPlatform = "desktop" | "mobile";

export type ListAssetProps = Omit<React.ComponentProps<"div">, "title"> & {
  symbol?: React.ReactNode;
  subtitle?: React.ReactNode;
  balance?: React.ReactNode;
  balanceSub?: React.ReactNode;
  /** Asset mark. Falls back to the symbol's first two letters. */
  icon?: React.ReactNode;
  variant?: ListAssetVariant;
  platform?: ListAssetPlatform;
  networks?: React.ReactNode[];
  networkOverflow?: number;
  networkIsNew?: boolean;
  actions?: React.ReactNode;
  onAdd?: () => void;
  onSend?: () => void;
  showAction?: boolean;
};

/** Asset row: mark, symbol, balance, supported networks and actions. Built on `ListItem`. */
export function ListAsset({
  symbol,
  subtitle,
  balance,
  balanceSub,
  icon,
  variant = "stablecoin",
  platform = "desktop",
  networks,
  networkOverflow = 0,
  networkIsNew = false,
  actions,
  onAdd,
  onSend,
  showAction = true,
  className,
  ...rest
}: ListAssetProps) {
  const isMobile = platform === "mobile";
  const hasNetworks =
    variant === "stablecoin" &&
    ((networks && networks.length > 0) || networkOverflow > 0 || networkIsNew);
  const mark =
    icon ?? (typeof symbol === "string" && symbol ? symbol.slice(0, 2).toUpperCase() : null);

  let trailing: React.ReactNode = null;
  if (isMobile) {
    trailing = (
      <Icon name="arrow_forward_ios" className="list-asset__chevron" />
    );
  } else if (showAction) {
    trailing = (
      <div className="list-asset__actions">
        {actions ?? (
          <>
            <IconButton variant="secondary" size="sm" icon="add" label="Add" onClick={onAdd} />
            <IconButton
              variant="secondary"
              size="sm"
              icon="arrow_outward"
              label="Send"
              onClick={onSend}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <ListItem
      data-platform={platform}
      data-variant={variant}
      className={cn(
        "list-asset",
        `list-asset--${platform}`,
        `list-asset--${variant}`,
        className,
      )}
      leading={mark != null ? <span className="list-asset__icon">{mark}</span> : undefined}
      title={symbol}
      description={subtitle != null && subtitle !== "" ? subtitle : undefined}
      trailing={trailing}
      {...rest}
    >
      <div className="list-asset__balance">
        {balance != null && (
          <span className="list-asset__balance-value numeric">{balance}</span>
        )}
        {balanceSub != null && (
          <span className="list-asset__balance-sub">{balanceSub}</span>
        )}
      </div>

      {hasNetworks && (
        <ListSupportedNetwork
          className="list-asset__networks"
          networks={networks || []}
          overflow={networkOverflow}
          isNew={networkIsNew}
        />
      )}
    </ListItem>
  );
}
