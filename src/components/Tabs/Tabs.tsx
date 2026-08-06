import React, { useState } from "react";
import "./Tabs.css";

export type TabItem = {
  id: string;
  label: string;
  content?: React.ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  /** Tab items */
  items?: TabItem[];
  /** Default active tab id (uncontrolled) */
  defaultTab?: string;
  /** Controlled active tab id */
  activeTab?: string;
  /** Tab change handler */
  onTabChange?: (id: string) => void;
  /** Visual variant */
  variant?: "default" | "secondary";
  /** Fill available width */
  fill?: boolean;
  /** Additional CSS class names */
  className?: string;
};

export function Tabs({
  items = [],
  defaultTab,
  activeTab,
  onTabChange,
  variant = "default",
  fill = false,
  className = "",
}: TabsProps) {
  const [internal, setInternal] = useState(defaultTab || items[0]?.id);
  const current = activeTab ?? internal;
  const setCurrent = (id: string) => {
    if (activeTab === undefined) setInternal(id);
    onTabChange && onTabChange(id);
  };
  const activeItem = items.find((i) => i.id === current);
  const cls = [
    "tabs",
    variant === "secondary" && "tabs--secondary",
    fill && "tabs--fill",
    className,
  ].filter(Boolean).join(" ");
  return (
    <div className={cls}>
      <div className="tabs__strip" role="tablist">
        {items.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            className={"tabs__tab" + (current === t.id ? " is-active" : "")}
            aria-selected={current === t.id}
            disabled={t.disabled}
            onClick={() => setCurrent(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {activeItem?.content && (
        <div className="tabs__panel" role="tabpanel">
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
