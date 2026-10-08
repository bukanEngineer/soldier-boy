import React from "react";
import { cn } from "../../lib/cn";
import "./InlineCrossAsset.css";
import { Icon } from "../Icon/Icon";
import { AssetMark } from "../AssetMark/AssetMark";

export type InlineCrossAssetProps = React.ComponentProps<"div"> & {
  from?: React.ReactNode;
  to?: React.ReactNode;
  fromIcon?: React.ReactNode;
  toIcon?: React.ReactNode;
  caption?: React.ReactNode;
};

const ICON_SIZE = 20;

/* Explicit icon wins; `null` hides it; otherwise a string symbol resolves to
 * its AssetMark (the stablecoin logo for XSGD, XUSD, SGD, USD, ...). */
function resolveIcon(icon: React.ReactNode, symbol: React.ReactNode) {
  if (icon !== undefined) return icon;
  return typeof symbol === "string" && symbol !== ""
    ? <AssetMark asset={symbol} size={ICON_SIZE} />
    : null;
}

export function InlineCrossAsset({
  from = "XUSD",
  to = "USD",
  fromIcon,
  toIcon,
  caption = "Your XUSD will be converted 1:1 to USD",
  className,
  ...rest
}: InlineCrossAssetProps) {
  const fromMark = resolveIcon(fromIcon, from);
  const toMark = resolveIcon(toIcon, to);

  return (
    <div className={cn("inline-cross-asset", className)} {...rest}>
      <div className="inline-cross-asset__row">
        <span className="inline-cross-asset__asset">
          {fromMark != null && (
            <span className="inline-cross-asset__icon">{fromMark}</span>
          )}
          <span className="inline-cross-asset__symbol">{from}</span>
        </span>
        <Icon name="arrow_forward" className="inline-cross-asset__arrow" />
        <span className="inline-cross-asset__asset">
          {toMark != null && (
            <span className="inline-cross-asset__icon">{toMark}</span>
          )}
          <span className="inline-cross-asset__symbol">{to}</span>
        </span>
      </div>
      {caption != null && caption !== "" && (
        <p className="inline-cross-asset__caption">{caption}</p>
      )}
    </div>
  );
}
