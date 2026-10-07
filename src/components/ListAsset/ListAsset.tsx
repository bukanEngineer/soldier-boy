import React from "react";
import { ListSupportedNetwork } from "../ListSupportedNetwork/ListSupportedNetwork";
import { cn } from "../../lib/cn";
import "./ListAsset.css";

export type ListAssetVariant = "stablecoin" | "fiat" | string;
export type ListAssetPlatform = "desktop" | "mobile";

export type ListAssetProps = React.ComponentProps<"div"> & {
  symbol?: React.ReactNode;
  subtitle?: React.ReactNode;
  balance?: React.ReactNode;
  balanceSub?: React.ReactNode;
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

export function ListAsset({
  symbol = "XSGD",
  subtitle = "1:1 to SGD",
  balance = "0.00",
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

  return (
    <div
      data-platform={platform}
      data-variant={variant}
      className={cn(
        "list-asset",
        `list-asset--${platform}`,
        `list-asset--${variant}`,
        className,
      )}
      {...rest}
    >
      <div className="list-asset__lead">
        {icon != null && <span className="list-asset__icon">{icon}</span>}
        <div className="list-asset__currency">
          <span className="list-asset__symbol">{symbol}</span>
          {subtitle != null && subtitle !== "" && (
            <span className="list-asset__subtitle">{subtitle}</span>
          )}
        </div>
      </div>

      <div className="list-asset__balance">
        <span className="list-asset__balance-value numeric">{balance}</span>
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

      {showAction && !isMobile && (
        <div className="list-asset__actions">
          {actions != null ? (
            actions
          ) : (
            <>
              <button
                type="button"
                className="list-asset__icon-btn"
                aria-label="Add"
                onClick={onAdd}
              >
                <span className="material-symbols-rounded" aria-hidden="true">
                  add
                </span>
              </button>
              <button
                type="button"
                className="list-asset__icon-btn"
                aria-label="Send"
                onClick={onSend}
              >
                <span className="material-symbols-rounded" aria-hidden="true">
                  arrow_outward
                </span>
              </button>
            </>
          )}
        </div>
      )}

      {isMobile && (
        <span className="list-asset__chevron material-symbols-rounded" aria-hidden="true">
          arrow_forward_ios
        </span>
      )}
    </div>
  );
}
