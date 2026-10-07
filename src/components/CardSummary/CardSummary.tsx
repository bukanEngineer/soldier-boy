import React from "react";
import { Icon } from "../Icon/Icon";
import { Button } from "../Button/Button";
import { Card, CardDetailRow } from "../Card/Card";
import { cn } from "../../lib/cn";
import "./CardSummary.css";

export type CardSummaryCurrencySide = {
  label?: string;
  logo?: React.ReactNode;
};

export type CardSummaryItem = {
  label?: React.ReactNode;
  value?: React.ReactNode;
  info?: boolean;
};

export type CardSummaryProps = Omit<React.ComponentProps<"section">, "title"> & {
  title?: React.ReactNode;
  conversion?: {
    from?: CardSummaryCurrencySide;
    to?: CardSummaryCurrencySide;
    note?: React.ReactNode;
  };
  items?: CardSummaryItem[];
  netAmount?: { label?: React.ReactNode; value?: React.ReactNode };
  note?: { title?: React.ReactNode; body?: React.ReactNode };
  button?: { label?: React.ReactNode; onClick?: () => void };
};

/** Transfer / mint summary card. */
export function CardSummary({
  title = "Transfer Details",
  conversion,
  items = [],
  netAmount,
  note,
  button,
  className,
  ...rest
}: CardSummaryProps) {
  return (
    <Card className={cn("card-summary", className)} {...rest}>
      <p className="card-summary__title">{title}</p>

      {conversion && (
        <div className="card-summary__conversion">
          <div className="card-summary__conversion-row">
            <CurrencyChip side={conversion.from} />
            <Icon name="arrow_forward" size={18} className="card-summary__arrow" />
            <CurrencyChip side={conversion.to} />
          </div>
          {conversion.note && <p className="card-summary__conversion-note">{conversion.note}</p>}
        </div>
      )}

      {items.length > 0 && (
        <dl className="card-summary__items">
          {items.map((item, i) => (
            <CardDetailRow
              key={String(item.label) || i}
              label={item.label}
              value={item.value}
              info={item.info}
              infoPlacement="value"
              infoSize={18}
            />
          ))}
        </dl>
      )}

      {netAmount && (
        <div className="card-summary__net-wrap">
          <div className="card-summary__divider" />
          <div className="card-summary__net">
            <span className="card-summary__net-label">{netAmount.label}</span>
            <span className="card-summary__net-value">{netAmount.value}</span>
          </div>
        </div>
      )}

      {note && (
        <div className="card-summary__note">
          <span className="card-summary__note-bar" aria-hidden="true" />
          <div className="card-summary__note-content">
            {note.title && <p className="card-summary__note-title">{note.title}</p>}
            {note.body && <p className="card-summary__note-body">{note.body}</p>}
          </div>
        </div>
      )}

      {button && (
        <Button variant="primary" size="lg" className="card-summary__btn" onClick={button.onClick}>
          {button.label}
        </Button>
      )}
    </Card>
  );
}

function CurrencyChip({ side }: { side?: CardSummaryCurrencySide }) {
  if (!side) return null;
  return (
    <span className="card-summary__chip">
      <span className="card-summary__chip-logo" aria-hidden="true">
        {side.logo || (
          <span className="card-summary__chip-initial">{(side.label || "?").charAt(0)}</span>
        )}
      </span>
      <span className="card-summary__chip-label">{side.label}</span>
    </span>
  );
}
