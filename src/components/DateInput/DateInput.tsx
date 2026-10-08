import React, { useId, useState } from "react";
import { Calendar } from "../Calendar/Calendar";
import { Popover } from "../Popover/Popover";
import { cn } from "../../lib/cn";
import { inputClasses, type InputSize } from "../Input/styles";
import "../Input/Input.css";
import "./DateInput.css";
import { Icon } from "../Icon/Icon";

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
  /** Input size */
  size?: InputSize;
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
  /** Value change handler (single mode) */
  onValueChange?: (value: string) => void;
  /** Range start value (ISO) */
  startValue?: string;
  /** Range end value (ISO) */
  endValue?: string;
  /** Range change handler */
  onRangeChange?: (range: { start?: string; end?: string }) => void;
  /** Disables interaction */
  disabled?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled default open */
  defaultOpen?: boolean;
  /** Open change handler */
  onOpenChange?: (open: boolean) => void;
  /** Element id */
  id?: string;
  /** Additional CSS class names on the trigger */
  className?: string;
};

/**
 * Bare date picker control for use inside `Field`. Label, helper and error
 * come from `Field`. Calendar opens in a `Popover`.
 *
 *   <Field.Root>
 *     <Field.Label>Date of birth</Field.Label>
 *     <DateInput defaultValue="1990-04-15" />
 *   </Field.Root>
 */
export function DateInput({
  size = "large",
  range = false,
  placeholder,
  value,
  defaultValue,
  onChange,
  onValueChange,
  startValue,
  endValue,
  onRangeChange,
  disabled = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  id: idProp,
  className,
}: DateInputProps) {
  const autoId = useId();
  const id = idProp || autoId;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const selectedDate = parseISO(currentValue);
  const startDate = parseISO(startValue);
  const endDate = parseISO(endValue);

  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isOpenControlled ? openProp : internalOpen;

  const setOpen = (next: boolean) => {
    if (disabled) return;
    if (!isOpenControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleSelect = (date: Date) => {
    const iso = toISO(date);
    if (!isControlled) setInternalValue(iso);
    onValueChange?.(iso);
    onChange?.({ target: { value: iso } });
    setOpen(false);
  };

  const handleRangeSelect = ({ from, to }: { from?: Date; to?: Date }) => {
    onRangeChange?.({
      start: from ? toISO(from) : undefined,
      end: to ? toISO(to) : undefined,
    });
    if (from && to) setOpen(false);
  };

  let displayText = placeholder || (range ? "Pick a date range" : "Pick a date");
  let isPlaceholder = true;
  if (range && (startDate || endDate)) {
    displayText =
      startDate && endDate
        ? `${DATE_FMT.format(startDate)} - ${DATE_FMT.format(endDate)}`
        : `${DATE_FMT.format((startDate || endDate)!)} - …`;
    isPlaceholder = false;
  } else if (!range && selectedDate) {
    displayText = DATE_FMT.format(selectedDate);
    isPlaceholder = false;
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        id={id}
        disabled={disabled}
        className={cn(inputClasses.root, inputClasses.size[size], "date-input__trigger", className)}
        data-disabled={disabled || undefined}
      >
        <Icon name="calendar_today" className="input__lead" />
        <span
          className="date-input__value"
          data-placeholder={isPlaceholder || undefined}
        >
          {displayText}
        </span>
      </Popover.Trigger>
      <Popover.Popup side="bottom" align="start" sideOffset={8} className="date-input__popover">
        {range ? (
          <Calendar
            mode="range"
            numberOfMonths={2}
            value={{ from: startDate, to: endDate }}
            defaultMonth={startDate}
            onSelect={(v) => handleRangeSelect(v as { from?: Date; to?: Date })}
          />
        ) : (
          <Calendar
            value={selectedDate}
            defaultMonth={selectedDate}
            onSelect={(d) => handleSelect(d as Date)}
          />
        )}
      </Popover.Popup>
    </Popover.Root>
  );
}
