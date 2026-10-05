import React, { useEffect, useId, useRef, useState } from "react";
import { Calendar } from "../Calendar/Calendar";
import "../Input/Input.css";
import "./DateInput.css";

const DATE_FMT = new Intl.DateTimeFormat("en-SG", { day: "numeric", month: "long", year: "numeric" });

function parseISO(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export type DateInputProps = {
  /** Field label */
  label?: string;
  /** Helper text */
  helper?: string;
  /** Error message */
  error?: string;
  /** Input size */
  size?: "large" | "small";
  /** Enable range mode */
  range?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Controlled value (ISO date string) */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Change handler (single mode) */
  onChange?: (e: { target: { value: string } }) => void;
  /** Range start value (ISO) */
  startValue?: string;
  /** Range end value (ISO) */
  endValue?: string;
  /** Range change handler */
  onRangeChange?: (range: { start?: string; end?: string }) => void;
  /** Disables interaction */
  disabled?: boolean;
  /** Element id */
  id?: string;
  /** Additional CSS class names */
  className?: string;
};

export function DateInput({
  label,
  helper,
  error,
  size = "large",
  range = false,
  placeholder,
  value,
  defaultValue,
  onChange,
  startValue,
  endValue,
  onRangeChange,
  disabled = false,
  id: idProp,
  className = "",
}: DateInputProps) {
  const id = useId();
  const isError = !!error;
  const sizeCls = `input--${size === "small" ? "small" : "large"}`;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const selectedDate = parseISO(currentValue);
  const startDate = parseISO(startValue);
  const endDate = parseISO(endValue);

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClickAway = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleSelect = (date: Date) => {
    const iso = toISO(date);
    if (!isControlled) setInternalValue(iso);
    onChange && onChange({ target: { value: iso } });
    setOpen(false);
  };

  const handleRangeSelect = ({ from, to }: { from?: Date; to?: Date }) => {
    onRangeChange && onRangeChange({
      start: from ? toISO(from) : undefined,
      end: to ? toISO(to) : undefined,
    });
    if (from && to) setOpen(false);
  };

  let displayText = placeholder || (range ? "Pick a date range" : "Pick a date");
  let isPlaceholder = true;
  if (range && (startDate || endDate)) {
    displayText = startDate && endDate
      ? `${DATE_FMT.format(startDate)} - ${DATE_FMT.format(endDate)}`
      : `${DATE_FMT.format((startDate || endDate)!)} - …`;
    isPlaceholder = false;
  } else if (!range && selectedDate) {
    displayText = DATE_FMT.format(selectedDate);
    isPlaceholder = false;
  }

  const wrapCls = [
    "input",
    sizeCls,
    isError && "is-error",
    disabled && "is-disabled",
    open && "is-focused",
    "date-input__trigger",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className="field">
      {label && <label htmlFor={idProp || id} className="field__label">{label}</label>}
      <div className="date-input__wrap" ref={wrapRef}>
        <button
          id={idProp || id}
          type="button"
          className={wrapCls}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className="material-symbols-rounded input__lead" aria-hidden="true">calendar_today</span>
          <span className={"date-input__value" + (isPlaceholder ? " is-placeholder" : "")}>
            {displayText}
          </span>
        </button>
        {open && (
          <div className="date-input__popover">
            {range ? (
              <Calendar
                mode="range"
                numberOfMonths={2}
                value={{ from: startDate, to: endDate }}
                defaultMonth={startDate}
                onSelect={(v) => handleRangeSelect(v as { from?: Date; to?: Date })}
              />
            ) : (
              <Calendar value={selectedDate} defaultMonth={selectedDate} onSelect={(d) => handleSelect(d as Date)} />
            )}
          </div>
        )}
      </div>
      {(helper || error) && (
        <span className={"field__helper" + (isError ? " is-error" : "")}>{error || helper}</span>
      )}
    </div>
  );
}
