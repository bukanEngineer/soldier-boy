import React from "react";
import { Select } from "../Select/Select";
import { cn } from "../../lib/cn";
import "./FieldOptionSelect.css";

export type FieldOptionStatus = {
  label: React.ReactNode;
  variant?: "positive" | "critical" | "warning" | "information";
};

export type FieldOptionAction = {
  label: React.ReactNode;
  onClick: () => void;
};

export type FieldOption = {
  value: string;
  name?: string;
  logo?: React.ReactNode;
  /** Supporting lines under the name (account, swift, address, …) */
  lines?: React.ReactNode[];
  status?: FieldOptionStatus;
  action?: FieldOptionAction;
  disabled?: boolean;
};

export type FieldOptionSelectProps = {
  options?: FieldOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, option?: FieldOption) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

function OptionMark({ option }: { option: FieldOption }) {
  const label = option.name ?? option.value;
  return (
    <span className="field-option-select__mark" aria-hidden="true">
      {option.logo || (
        <span className="field-option-select__initials">
          {String(label || "?").slice(0, 2).toUpperCase()}
        </span>
      )}
    </span>
  );
}

function OptionText({ option }: { option: FieldOption }) {
  const lines = (option.lines || []).filter((line) => line != null && line !== "");
  return (
    <span className="field-option-select__text">
      <span className="field-option-select__name">{option.name ?? option.value}</span>
      {lines.map((line, i) => (
        <span key={i} className="field-option-select__secondary">
          {line}
        </span>
      ))}
      {option.status && (
        <span className="field-option-select__tags">
          <span
            className="field-option-select__tag"
            data-variant={option.status.variant || "critical"}
          >
            {option.status.label}
          </span>
        </span>
      )}
    </span>
  );
}

/**
 * Rich option Select used by FieldBank / FieldBlockchain / FieldNetwork.
 * Label, helper and error come from `Field`. Header actions (e.g. Add Account)
 * are composed beside `Field.Label` in the consumer.
 */
export function FieldOptionSelect({
  options = [],
  value,
  defaultValue = null,
  onValueChange,
  placeholder = "Select…",
  disabled = false,
  className,
}: FieldOptionSelectProps) {
  const items = options.map((o) => ({ value: o.value, label: o.name ?? o.value }));

  return (
    <Select.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      onValueChange={(next) => {
        const opt = options.find((o) => o.value === next);
        onValueChange?.(next, opt);
      }}
    >
      <Select.Trigger className={cn("field-option-select", className)}>
        <Select.Value placeholder={placeholder}>
          {(selected) => {
            const opt = options.find((o) => o.value === selected);
            if (!opt) {
              return <span className="field-option-select__placeholder">{placeholder}</span>;
            }
            return (
              <>
                <OptionMark option={opt} />
                <OptionText option={opt} />
              </>
            );
          }}
        </Select.Value>
        <Select.Icon />
      </Select.Trigger>
      <Select.Popup className="field-option-select__popup" positionerProps={{ alignItemWithTrigger: false }}>
        <Select.List>
          {options.map((o) => (
            <Select.Item key={o.value} value={o.value} disabled={o.disabled}>
              <span className="field-option-select__item">
                <OptionMark option={o} />
                <OptionText option={o} />
                {o.action && (
                  <button
                    type="button"
                    className="field-option-select__link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      o.action?.onClick();
                    }}
                  >
                    {o.action.label}
                  </button>
                )}
              </span>
            </Select.Item>
          ))}
        </Select.List>
      </Select.Popup>
    </Select.Root>
  );
}
