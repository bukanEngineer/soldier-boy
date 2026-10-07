import React from "react";
import { Icon } from "../Icon/Icon";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { Card } from "../Card/Card";
import { InputCurrency } from "../InputCurrency/InputCurrency";
import type { InputCurrencyAssetOption } from "../InputCurrency/InputCurrency";
import { cn } from "../../lib/cn";
import "./CardSwap.css";

export type CardSwapLeg = {
  amount?: string;
  balance?: React.ReactNode;
  currency?: string;
  logo?: React.ReactNode;
  options?: InputCurrencyAssetOption[];
  onAmountChange?: (value: string) => void;
  onCurrencyChange?: (value: string, option?: InputCurrencyAssetOption) => void;
  onMax?: () => void;
};

export type CardSwapProps = Omit<React.ComponentProps<"section">, "title"> & {
  title?: React.ReactNode;
  from?: CardSwapLeg;
  to?: CardSwapLeg;
  rate?: React.ReactNode;
  highlight?: React.ReactNode;
  footnote?: React.ReactNode;
  buttonLabel?: React.ReactNode;
  onSwap?: () => void;
  onReverse?: () => void;
};

/** Currency swap card composed around `InputCurrency`. */
export function CardSwap({
  title = "Swap",
  from = {},
  to = {},
  rate,
  highlight,
  footnote,
  buttonLabel = "Swap",
  onSwap,
  onReverse,
  className,
  ...rest
}: CardSwapProps) {
  return (
    <Card className={cn("card-swap", className)} {...rest}>
      <p className="card-swap__title">{title}</p>

      <Leg label="From" leg={from} />

      <div className="card-swap__rate-row">
        <div className="card-swap__rate-col">
          {rate && <span className="card-swap__rate">{rate}</span>}
          {highlight && (
            <span className="card-swap__highlight">
              <Icon name="check_circle" size={18} className="card-swap__highlight-icon" />
              {highlight}
            </span>
          )}
        </div>
        <IconButton
          variant="secondary"
          size="sm"
          icon="swap_vert"
          label="Reverse"
          onClick={onReverse}
        />
      </div>

      <Leg label="To" leg={to} />

      <Button variant="primary" size="lg" className="card-swap__btn" onClick={onSwap}>
        {buttonLabel}
      </Button>

      {footnote && <p className="card-swap__footnote">{footnote}</p>}
    </Card>
  );
}

function Leg({ label, leg }: { label: string; leg: CardSwapLeg }) {
  return (
    <div className="card-swap__leg">
      <div className="card-swap__leg-labels">
        <span className="card-swap__leg-label">{label}</span>
        {leg.balance && <span className="card-swap__leg-balance">Balance: {leg.balance}</span>}
      </div>
      <InputCurrency
        position="suffix"
        placeholder="0"
        value={leg.amount}
        onChange={leg.onAmountChange ? (e) => leg.onAmountChange?.(e.target.value) : undefined}
        readOnly={!leg.onAmountChange}
        linkButton={leg.onMax ? { label: "Max", onClick: leg.onMax } : undefined}
        asset={{
          value: leg.currency,
          symbol: leg.currency,
          logo: leg.logo,
          options: leg.options,
          onChange: leg.onCurrencyChange,
        }}
      />
    </div>
  );
}
