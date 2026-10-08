import React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { withClass } from "../../lib/cn";
import "./MultiSelect.css";
import { Icon, resolveIcon } from "../Icon/Icon";

export type MultiSelectRootProps<Value = string> = BaseCombobox.Root.Props<Value, true>;

function MultiSelectRoot<Value = string>({
  multiple = true as const,
  ...props
}: MultiSelectRootProps<Value>) {
  return <BaseCombobox.Root multiple={multiple} {...props} />;
}

export type MultiSelectInputGroupProps = BaseCombobox.InputGroup.Props;

function MultiSelectInputGroup({ className, ...props }: MultiSelectInputGroupProps) {
  return (
    <BaseCombobox.InputGroup className={withClass("multiselect", className)} {...props} />
  );
}

export type MultiSelectChipsProps = BaseCombobox.Chips.Props;

function MultiSelectChips({ className, ...props }: MultiSelectChipsProps) {
  return <BaseCombobox.Chips className={withClass("multiselect__chips", className)} {...props} />;
}

export type MultiSelectChipProps = BaseCombobox.Chip.Props;

function MultiSelectChip({ className, ...props }: MultiSelectChipProps) {
  return <BaseCombobox.Chip className={withClass("multiselect__chip", className)} {...props} />;
}

export type MultiSelectChipRemoveProps = BaseCombobox.ChipRemove.Props;

function MultiSelectChipRemove({
  className,
  children = "close",
  ...props
}: MultiSelectChipRemoveProps) {
  return (
    <BaseCombobox.ChipRemove
      className={withClass("multiselect__chip-x", className)}
      {...props}
    >
      {resolveIcon(children)}
    </BaseCombobox.ChipRemove>
  );
}

export type MultiSelectInputProps = BaseCombobox.Input.Props;

function MultiSelectInput({ className, ...props }: MultiSelectInputProps) {
  return <BaseCombobox.Input className={withClass("multiselect__input", className)} {...props} />;
}

export type MultiSelectClearProps = BaseCombobox.Clear.Props;

function MultiSelectClear({ className, children = "close", ...props }: MultiSelectClearProps) {
  return (
    <BaseCombobox.Clear
      className={withClass("multiselect__clear", className)}
      {...props}
    >
      {resolveIcon(children)}
    </BaseCombobox.Clear>
  );
}

export type MultiSelectTriggerProps = BaseCombobox.Trigger.Props;

function MultiSelectTrigger({ className, children = "expand_more", ...props }: MultiSelectTriggerProps) {
  return (
    <BaseCombobox.Trigger
      className={withClass("multiselect__chevron", className)}
      {...props}
    >
      {resolveIcon(children)}
    </BaseCombobox.Trigger>
  );
}

type PositionerProps = BaseCombobox.Positioner.Props;

export type MultiSelectPopupProps = BaseCombobox.Popup.Props &
  Pick<PositionerProps, "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding" | "anchor"> & {
    positionerProps?: Omit<PositionerProps, "side" | "align" | "sideOffset" | "alignOffset">;
  };

function MultiSelectPopup({
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset,
  collisionPadding,
  anchor,
  positionerProps,
  className,
  children,
  ...props
}: MultiSelectPopupProps) {
  const { className: positionerClassName, ...restPositioner } = positionerProps ?? {};
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
        className={withClass("multiselect__positioner", positionerClassName)}
        {...restPositioner}
      >
        <BaseCombobox.Popup className={withClass("multiselect__popup", className)} {...props}>
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

export type MultiSelectListProps = BaseCombobox.List.Props;
export type MultiSelectEmptyProps = BaseCombobox.Empty.Props;
export type MultiSelectItemProps = BaseCombobox.Item.Props;
export type MultiSelectValueProps = BaseCombobox.Value.Props;

function MultiSelectList({ className, ...props }: MultiSelectListProps) {
  return <BaseCombobox.List className={withClass("multiselect__list", className)} {...props} />;
}

function MultiSelectEmpty({ className, ...props }: MultiSelectEmptyProps) {
  return <BaseCombobox.Empty className={withClass("multiselect__empty", className)} {...props} />;
}

function MultiSelectItem({ className, children, ...props }: MultiSelectItemProps) {
  return (
    <BaseCombobox.Item className={withClass("multiselect__item", className)} {...props}>
      <span className="multiselect__check" aria-hidden="true">
        <Icon name="check_box_outline_blank" className="multiselect__check-off" />
        <BaseCombobox.ItemIndicator>
          <Icon name="check_box" />
        </BaseCombobox.ItemIndicator>
      </span>
      <span className="multiselect__item-text">{children}</span>
    </BaseCombobox.Item>
  );
}

/**
 * Multi-select built on Base UI Combobox (`multiple`). Label / helper / error
 * come from `Field`. Compose:
 *
 *   <MultiSelect.Root items={networks} multiple>
 *     <MultiSelect.InputGroup>
 *       <MultiSelect.Value>
 *         {(value: string[]) => (
 *           <MultiSelect.Chips>
 *             {value.map((v) => (
 *               <MultiSelect.Chip key={v}>{labelFor(v)}
 *                 <MultiSelect.ChipRemove aria-label={`Remove ${v}`} />
 *               </MultiSelect.Chip>
 *             ))}
 *             <MultiSelect.Input placeholder={value.length ? "" : "Select…"} />
 *           </MultiSelect.Chips>
 *         )}
 *       </MultiSelect.Value>
 *       <MultiSelect.Clear aria-label="Clear all" />
 *       <MultiSelect.Trigger />
 *     </MultiSelect.InputGroup>
 *     <MultiSelect.Popup>
 *       <MultiSelect.Empty>No matches</MultiSelect.Empty>
 *       <MultiSelect.List>
 *         {(item) => <MultiSelect.Item key={item} value={item}>{item}</MultiSelect.Item>}
 *       </MultiSelect.List>
 *     </MultiSelect.Popup>
 *   </MultiSelect.Root>
 */
export const MultiSelect = {
  Root: MultiSelectRoot,
  Value: BaseCombobox.Value as typeof BaseCombobox.Value,
  InputGroup: MultiSelectInputGroup,
  Chips: MultiSelectChips,
  Chip: MultiSelectChip,
  ChipRemove: MultiSelectChipRemove,
  Input: MultiSelectInput,
  Clear: MultiSelectClear,
  Trigger: MultiSelectTrigger,
  Popup: MultiSelectPopup,
  List: MultiSelectList,
  Empty: MultiSelectEmpty,
  Item: MultiSelectItem,
};
