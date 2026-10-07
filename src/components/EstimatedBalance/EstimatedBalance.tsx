import React from "react";
import { Icon } from "../Icon/Icon";
import { cn } from "../../lib/cn";
import "./EstimatedBalance.css";

export type EstimatedBalanceProps = React.ComponentProps<"div"> & {
  label?: React.ReactNode;
  amount?: React.ReactNode;
  currency?: React.ReactNode;
  showInfo?: boolean;
};

export function EstimatedBalance({
  label = "Estimated Balance",
  amount = "2,081.23",
  currency = "SGD",
  showInfo = true,
  className,
  ...rest
}: EstimatedBalanceProps) {
  return (
    <div className={cn("estimated-balance", className)} {...rest}>
      <div className="estimated-balance__title">
        <span className="estimated-balance__label">{label}</span>
        {showInfo && <Icon name="info" size={18} className="estimated-balance__info" />}
      </div>
      <div className="estimated-balance__amount">
        <span className="estimated-balance__value">{amount}</span>
        {currency != null && currency !== "" && (
          <span className="estimated-balance__currency">{currency}</span>
        )}
      </div>
    </div>
  );
}
