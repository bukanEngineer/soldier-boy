import React from "react";
import { BottomSheet, type BottomSheetRootProps } from "./BottomSheet";
import { cn } from "../../lib/cn";
import "./BottomSheetSelect.css";

/** One selectable row: asset mark + name + optional secondary text. */
export type BottomSheetSelectItem = {
  id: string;
  name: string;
  description?: React.ReactNode;
  /** Logo / mark element. Falls back to the first letter of `name`. */
  mark?: React.ReactNode;
};

export type BottomSheetSelectProps<Item extends BottomSheetSelectItem> = Omit<
  BottomSheetRootProps,
  "children"
> & {
  /** Sheet heading */
  title: React.ReactNode;
  items: Item[];
  /** Id of the selected item */
  value?: string | null;
  /** Called with the picked item's id and the item itself */
  onValueChange?: (value: string, item: Item) => void;
  /** Class names for the sheet panel */
  className?: string;
};

/**
 * Internal single-select list sheet shared by BottomSheetBank,
 * BottomSheetBlockchain and BottomSheetNetwork. Not exported from the package.
 */
export function BottomSheetSelect<Item extends BottomSheetSelectItem>({
  title,
  items,
  value,
  onValueChange,
  className,
  ...rootProps
}: BottomSheetSelectProps<Item>) {
  return (
    <BottomSheet.Root {...rootProps}>
      <BottomSheet.Popup className={cn("bsheet-select", className)}>
        <BottomSheet.Header>
          <BottomSheet.Title>{title}</BottomSheet.Title>
          <BottomSheet.Close />
        </BottomSheet.Header>
        <BottomSheet.Body>
          <ul className="bsheet-select__list">
            {items.map((item) => {
              const selected = item.id === value;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="bsheet-select__item"
                    data-selected={selected || undefined}
                    aria-pressed={selected}
                    onClick={() => onValueChange?.(item.id, item)}
                  >
                    <span className="bsheet-select__mark" aria-hidden="true">
                      {item.mark || item.name.slice(0, 1)}
                    </span>
                    <span className="bsheet-select__text">
                      <span className="bsheet-select__name">{item.name}</span>
                      {item.description && (
                        <span className="bsheet-select__desc">{item.description}</span>
                      )}
                    </span>
                    <span className="material-symbols-rounded bsheet-select__check" aria-hidden="true">
                      {selected ? "radio_button_checked" : "radio_button_unchecked"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </BottomSheet.Body>
      </BottomSheet.Popup>
    </BottomSheet.Root>
  );
}
