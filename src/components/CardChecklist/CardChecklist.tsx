import React from "react";
import { Icon } from "../Icon/Icon";
import { LinkButton } from "../LinkButton/LinkButton";
import { Card } from "../Card/Card";
import { List, ListItem } from "../List/List";
import { cn } from "../../lib/cn";
import "./CardChecklist.css";

export type CardChecklistTab = {
  value: string;
  label: React.ReactNode;
};

export type CardChecklistItem = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  status?: "done" | "active" | "locked" | string;
  linkText?: React.ReactNode;
  onLink?: () => void;
};

export type CardChecklistProps = Omit<React.ComponentProps<"section">, "title"> & {
  title?: React.ReactNode;
  tabs?: CardChecklistTab[];
  active?: string;
  onTabChange?: (value: string) => void;
  progress?: number;
  items?: CardChecklistItem[];
};

/** Onboarding checklist card with tabs and progress. */
export function CardChecklist({
  title,
  tabs = [],
  active,
  onTabChange,
  progress = 0,
  items = [],
  className,
  ...rest
}: CardChecklistProps) {
  return (
    <Card className={cn("card-checklist", className)} {...rest}>
      {title != null && <h3 className="card-checklist__title">{title}</h3>}

      {tabs.length > 0 && (
        <div className="card-checklist__tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={t.value === active}
              data-active={t.value === active || undefined}
              className="card-checklist__tab"
              onClick={onTabChange ? () => onTabChange(t.value) : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="card-checklist__progress">
        <div className="card-checklist__progress-track">
          <div
            className="card-checklist__progress-fill"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
        <span className="card-checklist__progress-pct num">{progress}%</span>
      </div>

      <List className="card-checklist__list">
        {items.map((item, i) => (
          <ListItem
            key={String(item.title) || i}
            className="card-checklist__item"
            data-active={item.status === "active" || undefined}
            data-status={item.status || undefined}
            leading={<ChecklistMark status={item.status} />}
            title={item.title}
            description={
              item.description || item.linkText ? (
                <span className="card-checklist__item-details">
                  {item.description && <span>{item.description}</span>}
                  {item.linkText && (
                    <LinkButton size="sm" trailingIcon="arrow_forward" onClick={item.onLink}>
                      {item.linkText}
                    </LinkButton>
                  )}
                </span>
              ) : undefined
            }
            trailing={
              <Icon
                name={item.status === "locked" ? "lock" : "chevron_right"}
                size={20}
                className="card-checklist__item-trailing"
              />
            }
          />
        ))}
      </List>
    </Card>
  );
}

function ChecklistMark({ status }: { status?: string }) {
  const icon =
    status === "done" ? "check_circle" : status === "locked" ? "lock" : "radio_button_unchecked";
  return (
    <span
      className="card-checklist__mark"
      data-status={status || "active"}
      aria-hidden="true"
    >
      <Icon name={icon} />
    </span>
  );
}
