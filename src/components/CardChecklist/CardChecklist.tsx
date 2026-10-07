import React from "react";
import { Icon } from "../Icon/Icon";
import { LinkButton } from "../LinkButton/LinkButton";
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
  title = "Start your journey with StraitsX",
  tabs = [],
  active,
  onTabChange,
  progress = 0,
  items = [],
  className,
  ...rest
}: CardChecklistProps) {
  return (
    <section className={cn("card-checklist", className)} {...rest}>
      <h3 className="card-checklist__title">{title}</h3>

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

      <ul className="card-checklist__list">
        {items.map((item, i) => (
          <li
            key={String(item.title) || i}
            className="card-checklist__item"
            data-active={item.status === "active" || undefined}
            data-status={item.status || undefined}
          >
            <ChecklistMark status={item.status} />
            <div className="card-checklist__item-body">
              <p className="card-checklist__item-title">{item.title}</p>
              {item.description && (
                <p className="card-checklist__item-desc">{item.description}</p>
              )}
              {item.linkText && (
                <LinkButton size="sm" trailingIcon="arrow_forward" onClick={item.onLink}>
                  {item.linkText}
                </LinkButton>
              )}
            </div>
            <Icon
              name={item.status === "locked" ? "lock" : "chevron_right"}
              size={20}
              className="card-checklist__item-trailing"
            />
          </li>
        ))}
      </ul>
    </section>
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
      <span className="material-symbols-rounded">{icon}</span>
    </span>
  );
}
