import React, { useState } from "react";
import { IconButton } from "../IconButton/IconButton";
import { cn } from "../../lib/cn";
import "./Calendar.css";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function isSameDay(a: Date | undefined, b: Date | undefined): boolean {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

type Cell = { date: Date; outside: boolean };

function buildWeeks(viewMonth: Date): Cell[][] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: Cell[] = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), outside: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), outside: false });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      outside: true,
    });
  }

  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export type CalendarRangeValue = {
  from?: Date;
  to?: Date;
};

export type CalendarProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  /** "single" (default) or "range" */
  mode?: "single" | "range";
  /** Selected value (Date for single, {from, to} for range) */
  value?: Date | CalendarRangeValue;
  /** Default month to display */
  defaultMonth?: Date;
  /** Selection handler */
  onSelect?: (value: Date | CalendarRangeValue) => void;
  /** Number of months to display */
  numberOfMonths?: number;
};

/**
 * Lightweight custom calendar (single + range). Kept instead of `react-day-picker`
 * to avoid a new dependency while the surface stays small and token-styled.
 * Pair with `DateInput` / `Popover` for form use.
 */
export function Calendar({
  mode = "single",
  value,
  defaultMonth,
  onSelect,
  numberOfMonths = 1,
  className,
  ...rest
}: CalendarProps) {
  const isRange = mode === "range";
  const from = isRange ? (value as CalendarRangeValue)?.from : undefined;
  const to = isRange ? (value as CalendarRangeValue)?.to : undefined;
  const single = isRange ? undefined : (value as Date | undefined);

  const [viewMonth, setViewMonth] = useState(() => {
    const base = (isRange ? from : single) || defaultMonth || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const today = new Date();
  const goto = (delta: number) => setViewMonth((m) => addMonths(m, delta));
  const months = Array.from({ length: numberOfMonths }, (_, i) => addMonths(viewMonth, i));

  const handleDayClick = (date: Date) => {
    if (!isRange) {
      onSelect?.(date);
      return;
    }
    if (!from || (from && to)) {
      onSelect?.({ from: date, to: undefined });
    } else if (date < from) {
      onSelect?.({ from: date, to: from });
    } else {
      onSelect?.({ from, to: date });
    }
  };

  const renderDay = ({ date, outside }: Cell) => {
    const isToday = isSameDay(date, today);
    let selected = false;
    let rangeStart = false;
    let rangeEnd = false;
    let inRange = false;
    if (isRange) {
      rangeStart = isSameDay(date, from);
      rangeEnd = isSameDay(date, to);
      inRange = !!from && !!to && date > from && date < to;
      selected = rangeStart || rangeEnd;
    } else {
      selected = isSameDay(date, single);
    }
    return (
      <button
        key={date.toISOString()}
        type="button"
        role="gridcell"
        data-outside={outside || undefined}
        data-selected={selected || undefined}
        data-in-range={inRange || undefined}
        data-range-start={rangeStart || undefined}
        data-range-end={rangeEnd || undefined}
        data-today={isToday && !selected ? "" : undefined}
        className="calendar__day"
        aria-current={isToday ? "date" : undefined}
        aria-selected={selected}
        onClick={() => handleDayClick(date)}
      >
        {date.getDate()}
      </button>
    );
  };

  return (
    <div
      className={cn("calendar", numberOfMonths > 1 && "calendar--multi", className)}
      {...rest}
    >
      <div className="calendar__months">
        {months.map((month, i) => (
          <div className="calendar__month" key={`${month.getFullYear()}-${month.getMonth()}`}>
            <div className="calendar__header">
              {i === 0 ? (
                <IconButton
                  icon="chevron_left"
                  variant="tertiary"
                  size="sm"
                  label="Previous month"
                  onClick={() => goto(-1)}
                />
              ) : (
                <span className="calendar__nav-spacer" aria-hidden="true" />
              )}
              <span className="calendar__title">
                {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
              </span>
              {i === months.length - 1 ? (
                <IconButton
                  icon="chevron_right"
                  variant="tertiary"
                  size="sm"
                  label="Next month"
                  onClick={() => goto(1)}
                />
              ) : (
                <span className="calendar__nav-spacer" aria-hidden="true" />
              )}
            </div>

            <div className="calendar__weekdays" aria-hidden="true">
              {WEEKDAYS.map((w) => (
                <span key={w} className="calendar__weekday">
                  {w}
                </span>
              ))}
            </div>

            <div role="grid" aria-label={`${MONTH_NAMES[month.getMonth()]} ${month.getFullYear()}`}>
              {buildWeeks(month).map((week, wi) => (
                <div className="calendar__week" role="row" key={wi}>
                  {week.map(renderDay)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
