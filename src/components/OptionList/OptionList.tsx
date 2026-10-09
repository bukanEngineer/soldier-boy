import React from "react";
import { cn } from "../../lib/cn";
import "./OptionList.css";

export type OptionListTagVariant = "positive" | "critical" | "warning" | "information";

export type OptionListTag = {
  label: React.ReactNode;
  variant?: OptionListTagVariant;
};

export type OptionListItem = {
  value: string;
  name?: string;
  /** Leading mark (logo / asset mark). Falls back to initials. */
  logo?: React.ReactNode;
  /** Supporting text under the name */
  secondary?: React.ReactNode;
  /** Trailing status tag */
  tag?: OptionListTag;
  /** Free-form trailing content (e.g. balance). Shown after `tag` when both are set. */
  trailing?: React.ReactNode;
  disabled?: boolean;
};

export type OptionListProps = Omit<React.ComponentProps<"ul">, "children"> & {
  options?: OptionListItem[];
  /** Currently selected value */
  value?: string;
  /** Called when an enabled option is picked */
  onValueChange?: (value: string, option: OptionListItem) => void;
};

/**
 * Shared listbox body for domain dropdowns (bank / blockchain / network / asset).
 * Mark + name + secondary + optional tag/trailing. Compose inside menus, sheets,
 * or free-standing panels — not a trigger.
 *
 *   <OptionList
 *     value={selected}
 *     onValueChange={setSelected}
 *     options={[{ value: "dbs", name: "DBS Bank", secondary: "•••• 1234" }]}
 *   />
 */
export function OptionList({
  options = [],
  value,
  onValueChange,
  className,
  ref,
  onKeyDown,
  onFocus,
  onBlur,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: OptionListProps) {
  const listRef = React.useRef<HTMLUListElement>(null);
  React.useImperativeHandle(ref, () => listRef.current!);
  const rows = React.useRef(new Map<string, HTMLButtonElement>());
  const focusWithin = React.useRef(false);
  const previousOptions = React.useRef(options);
  const search = React.useRef({ text: "", time: 0 });
  const [focusedValue, setFocusedValue] = React.useState<string | undefined>(value);
  const enabled = React.useMemo(() => options.filter((option) => !option.disabled), [options]);
  const tabStop =
    enabled.find((option) => option.value === focusedValue) ??
    enabled.find((option) => option.value === value) ??
    enabled[0];

  // Filtering can remove the focused DOM node without firing blur. Restore
  // focus to the nearest remaining option, or the empty list itself.
  React.useLayoutEffect(() => {
    if (focusWithin.current && !enabled.some((option) => option.value === focusedValue)) {
      const previousIndex = previousOptions.current.findIndex(
        (option) => option.value === focusedValue,
      );
      const next = enabled[Math.min(Math.max(previousIndex, 0), enabled.length - 1)];
      setFocusedValue(next?.value);
      if (next) rows.current.get(next.value)?.focus();
      else listRef.current?.focus();
    } else if (!focusWithin.current) {
      setFocusedValue(enabled.find((option) => option.value === value)?.value ?? enabled[0]?.value);
    }
    previousOptions.current = options;
  }, [options, enabled, value, focusedValue]);

  function focusOption(option: OptionListItem | undefined) {
    if (!option) return;
    setFocusedValue(option.value);
    rows.current.get(option.value)?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !enabled.length)
      return;
    const index = enabled.findIndex((option) => option.value === focusedValue);
    let next: OptionListItem | undefined;
    switch (event.key) {
      case "ArrowDown":
        next = enabled[(index + 1) % enabled.length];
        break;
      case "ArrowUp":
        next = enabled[(index - 1 + enabled.length) % enabled.length];
        break;
      case "Home":
        next = enabled[0];
        break;
      case "End":
        next = enabled[enabled.length - 1];
        break;
      default: {
        // Enter and Space retain native button activation. Typeahead only
        // moves focus and searches names, excluding balances and other text.
        if (event.key.length !== 1 || event.key === " ") return;
        const now = Date.now();
        const text =
          (now - search.current.time > 500 ? "" : search.current.text) + event.key.toLowerCase();
        search.current = { text, time: now };
        const query = [...text].every((letter) => letter === text[0]) ? text[0] : text;
        for (let offset = 1; offset <= enabled.length; offset++) {
          const option = enabled[(Math.max(index, 0) + offset) % enabled.length];
          const name =
            rows.current.get(option.value)?.querySelector(".option-list__name")?.textContent ??
            option.value;
          if (name.trim().toLowerCase().startsWith(query)) {
            next = option;
            break;
          }
        }
      }
    }
    event.preventDefault();
    focusOption(next);
  }

  return (
    <ul
      {...props}
      ref={listRef}
      className={cn("option-list", className)}
      tabIndex={enabled.length ? undefined : 0}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        focusWithin.current = true;
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) focusWithin.current = false;
        onBlur?.(event);
      }}
      role="listbox"
      aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? "Options")}
      aria-labelledby={ariaLabelledBy}
    >
      {options.map((o) => {
        const selected = o.value === value;
        const label = o.name ?? o.value;
        return (
          <li key={o.value} role="presentation">
            <button
              ref={(element) => {
                if (element) rows.current.set(o.value, element);
                else rows.current.delete(o.value);
              }}
              tabIndex={o.value === tabStop?.value ? 0 : -1}
              onFocus={() => setFocusedValue(o.value)}
              type="button"
              role="option"
              aria-selected={selected}
              disabled={o.disabled}
              data-selected={selected || undefined}
              data-disabled={o.disabled || undefined}
              className="option-list__row"
              onClick={() => onValueChange?.(o.value, o)}
            >
              <span className="option-list__mark" aria-hidden="true">
                {o.logo || (
                  <span className="option-list__initials">
                    {String(label || "?")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </span>
              <span className="option-list__text">
                <span className="option-list__name">{label}</span>
                {o.secondary != null && o.secondary !== "" && (
                  <span className="option-list__secondary">{o.secondary}</span>
                )}
              </span>
              {o.tag && (
                <span className="option-list__tag" data-variant={o.tag.variant || "positive"}>
                  {o.tag.label}
                </span>
              )}
              {o.trailing != null && <span className="option-list__trailing">{o.trailing}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
