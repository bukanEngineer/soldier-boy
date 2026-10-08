import React from "react";
import { cn } from "../../lib/cn";
import "./InlineCrossAsset.css";
import { Icon } from "../Icon/Icon";

export type InlineCrossAssetProps = React.ComponentProps<"div"> & {
  from?: React.ReactNode;
  to?: React.ReactNode;
  fromIcon?: React.ReactNode;
  toIcon?: React.ReactNode;
  caption?: React.ReactNode;
};

export function InlineCrossAsset({
  from = "XUSD",
  to = "USD",
  fromIcon,
  toIcon,
  caption = "Your XUSD will be converted 1:1 to USD",
  className,
  ...rest
}: InlineCrossAssetProps) {
  return (
    <div className={cn("inline-cross-asset", className)} {...rest}>
      <div className="inline-cross-asset__row">
        <span className="inline-cross-asset__asset">
          {fromIcon != null && (
            <span className="inline-cross-asset__icon">{fromIcon}</span>
          )}
          <span className="inline-cross-asset__symbol">{from}</span>
        </span>
        <Icon name="arrow_forward" className="inline-cross-asset__arrow" />
        <span className="inline-cross-asset__asset">
          {toIcon != null && (
            <span className="inline-cross-asset__icon">{toIcon}</span>
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
