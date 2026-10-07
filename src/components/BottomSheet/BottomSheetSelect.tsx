import React from "react";
import { BottomSheet, type BottomSheetRootProps } from "./BottomSheet";
import { OptionList, type OptionListItem } from "../OptionList/OptionList";
import { Field } from "../Field/Field";
import { Input } from "../Input";
import { cn } from "../../lib/cn";
import "./BottomSheetSelect.css";

/** One selectable row: asset mark + name + optional secondary text. */
export type BottomSheetSelectItem = {
  id: string;
  name: string;
  description?: React.ReactNode;
  /** Logo / mark element. Falls back to the initials of `name`. */
  mark?: React.ReactNode;
  disabled?: boolean;
};

export type BottomSheetSelectProps<Item extends BottomSheetSelectItem> = Omit<
  BottomSheetRootProps,
  "children"
> & {
  /** Sheet heading */
  title: React.ReactNode;
  /** Supporting text under the heading */
  description?: React.ReactNode;
  items: Item[];
  /** Id of the selected item */
  value?: string | null;
  /** Called with the picked item's id and the item itself */
  onValueChange?: (value: string, item: Item) => void;
  /** Show a search field that filters by name and text descriptions */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Shown when search matches nothing */
  emptyText?: React.ReactNode;
  /** Class names for the sheet panel */
  className?: string;
};

function matches(item: BottomSheetSelectItem, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const description = typeof item.description === "string" ? item.description : "";
  return `${item.name} ${description}`.toLowerCase().includes(q);
}

type SelectListProps<Item extends BottomSheetSelectItem> = Pick<
  BottomSheetSelectProps<Item>,
  "items" | "value" | "onValueChange" | "searchable" | "searchPlaceholder" | "emptyText"
> & { label?: string };

/** Search + list. Rendered inside the popup so the query resets whenever the sheet reopens. */
function SelectList<Item extends BottomSheetSelectItem>({
  items,
  value,
  onValueChange,
  searchable,
  searchPlaceholder,
  emptyText,
  label,
}: SelectListProps<Item>) {
  const [query, setQuery] = React.useState("");
  const options: OptionListItem[] = items
    .filter((item) => matches(item, query))
    .map((item) => ({
      value: item.id,
      name: item.name,
      logo: item.mark,
      secondary: item.description,
      disabled: item.disabled,
      trailing: (
        <span className="material-symbols-rounded bsheet-select__check" aria-hidden="true">
          {item.id === value ? "radio_button_checked" : "radio_button_unchecked"}
        </span>
      ),
    }));
  return (
    <>
      {searchable && (
        <div className="bsheet-select__search">
          <Field.Root>
            <Input
              type="search"
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
          </Field.Root>
        </div>
      )}
      <BottomSheet.Body>
        {options.length === 0 ? (
          <p className="bsheet-select__empty" role="status">
            {emptyText}
          </p>
        ) : (
          <OptionList
            options={options}
            value={value ?? undefined}
            aria-label={label}
            onValueChange={(id) => {
              const item = items.find((i) => i.id === id);
              if (item) onValueChange?.(id, item);
            }}
          />
        )}
      </BottomSheet.Body>
    </>
  );
}

/**
 * Single-select list sheet. Renders an `OptionList` (listbox / option
 * semantics) inside the BottomSheet shell; the Bank / Blockchain / Network
 * sheets are thin recipes over it.
 *
 *   <BottomSheetSelect title="Select asset" items={assets} value={id} onValueChange={setId} searchable />
 */
export function BottomSheetSelect<Item extends BottomSheetSelectItem>({
  title,
  description,
  items,
  value,
  onValueChange,
  searchable = false,
  searchPlaceholder = "Search",
  emptyText = "No results found",
  className,
  ...rootProps
}: BottomSheetSelectProps<Item>) {
  return (
    <BottomSheet.Root {...rootProps}>
      <BottomSheet.Popup
        className={cn("bsheet-select", className)}
        // Don't pop the keyboard open on touch just because the sheet opened.
        initialFocus={searchable ? (type) => type !== "touch" : true}
      >
        <BottomSheet.Header>
          <BottomSheet.Title>{title}</BottomSheet.Title>
          <BottomSheet.Close />
        </BottomSheet.Header>
        {description && (
          <BottomSheet.Description className="bsheet-select__intro">
            {description}
          </BottomSheet.Description>
        )}
        <SelectList
          items={items}
          value={value}
          onValueChange={onValueChange}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
          label={typeof title === "string" ? title : undefined}
        />
      </BottomSheet.Popup>
    </BottomSheet.Root>
  );
}
