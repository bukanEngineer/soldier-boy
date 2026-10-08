import React from "react";
import { StatusIcon } from "../StatusIcon/StatusIcon";
import { LinkButton } from "../LinkButton/LinkButton";
import { Card, CardDetailRow } from "../Card/Card";
import { cn } from "../../lib/cn";
import "./CardStatus.css";
import type { IconName } from "../Icon/Icon";

export type CardStatusSectionItem = {
  label?: React.ReactNode;
  value?: React.ReactNode;
  info?: boolean;
};

export type CardStatusSection = {
  title?: React.ReactNode;
  items: CardStatusSectionItem[];
};

export type CardStatusProps = React.ComponentProps<"div"> & {
  status?: "success" | "pending" | "error" | "info" | string;
  statusIcon?: IconName;
  title?: React.ReactNode;
  description?: React.ReactNode;
  sections?: CardStatusSection[];
  total?: { label?: React.ReactNode; value?: React.ReactNode };
  footerLink?: { text?: React.ReactNode; onClick?: () => void };
};

/** Status result card with optional detail sections and footer link. */
export function CardStatus({
  status = "success",
  statusIcon,
  title,
  description,
  sections = [],
  total,
  footerLink,
  className,
  ...rest
}: CardStatusProps) {
  return (
    <div className={cn("card-status", className)} {...rest}>
      <Card shadow={2} className="card-status__card">
        <header className="card-status__head">
          <StatusIcon variant={status} icon={statusIcon} size={36} />
          {title && <h3 className="card-status__title">{title}</h3>}
        </header>

        {description && <p className="card-status__desc">{description}</p>}

        {sections.map((section, i) => (
          <div key={String(section.title) || i} className="card-status__section">
            {section.title && <p className="card-status__section-title">{section.title}</p>}
            <dl className="card-status__items">
              {section.items.map((item, j) => (
                <CardDetailRow
                  key={String(item.label) || j}
                  label={item.label}
                  value={item.value}
                  info={item.info}
                  infoPlacement="label"
                  infoSize={16}
                />
              ))}
            </dl>
          </div>
        ))}

        {total && (
          <div className="card-status__total-wrap">
            <div className="card-status__divider" />
            <div className="card-status__total">
              <span className="card-status__total-label">{total.label}</span>
              <span className="card-status__total-value">{total.value}</span>
            </div>
          </div>
        )}
      </Card>

      {footerLink && (
        <LinkButton trailingIcon="arrow_forward" onClick={footerLink.onClick}>
          {footerLink.text}
        </LinkButton>
      )}
    </div>
  );
}
