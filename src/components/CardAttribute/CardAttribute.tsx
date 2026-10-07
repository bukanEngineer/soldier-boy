import React from "react";
import { Icon } from "../Icon/Icon";
import { Tag } from "../Tag/Tag";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { cn } from "../../lib/cn";
import "./CardAttribute.css";

export type CardAttributeItem = {
  label?: React.ReactNode;
  value?: React.ReactNode;
  info?: boolean;
  link?: string;
  copyable?: boolean;
  columns?: 1 | 2 | "full";
};

export type CardAttributeProps = Omit<React.ComponentProps<"section">, "title"> & {
  title?: React.ReactNode;
  status?: { label: React.ReactNode; tone?: "positive" | "critical" | "warning" | "info" | "neutral" };
  attributes?: CardAttributeItem[];
  actions?: {
    onReject?: () => void;
    onApprove?: () => void;
    rejectLabel?: React.ReactNode;
    approveLabel?: React.ReactNode;
  };
  onCopy?: (attr: CardAttributeItem) => void;
};

/** Attribute detail card with optional approve/reject actions. */
export function CardAttribute({
  title = "Transaction Details",
  status,
  attributes = [],
  actions,
  onCopy,
  className,
  ...rest
}: CardAttributeProps) {
  return (
    <Card className={cn("card-attribute", className)} {...rest}>
      <header className="card-attribute__head">
        <h3 className="card-attribute__title">{title}</h3>
        {status && <Tag tone={status.tone || "positive"}>{status.label}</Tag>}
      </header>

      <div className="card-attribute__divider" />

      <dl className="card-attribute__grid">
        {attributes.map((attr, i) => (
          <div
            key={String(attr.label) || i}
            className="card-attribute__item"
            data-full={attr.columns === 2 || attr.columns === "full" || undefined}
          >
            <dt className="card-attribute__label">
              {attr.label}
              {attr.info && <Icon name="info" size={20} className="card-attribute__info" />}
            </dt>
            <dd className="card-attribute__value-row">
              {attr.link ? (
                <a className="card-attribute__link" href={attr.link} target="_blank" rel="noreferrer">
                  {attr.value}
                </a>
              ) : (
                <span className="card-attribute__value">{attr.value}</span>
              )}
              {attr.copyable && (
                <button
                  type="button"
                  className="card-attribute__copy"
                  aria-label="Copy"
                  onClick={onCopy ? () => onCopy(attr) : undefined}
                >
                  <Icon name="content_copy" size={20} />
                </button>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {actions && (
        <>
          <div className="card-attribute__divider" />
          <div className="card-attribute__actions">
            <Button variant="secondary" size="sm" onClick={actions.onReject}>
              {actions.rejectLabel || "Reject"}
            </Button>
            <Button variant="primary" size="sm" onClick={actions.onApprove}>
              {actions.approveLabel || "Approve"}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
