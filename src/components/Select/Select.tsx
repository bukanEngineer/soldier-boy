import React, { createContext, useContext, useState } from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { cn, withClass } from "../../lib/cn";
import "./Select.css";

type SelectClearContextValue = {
  value: unknown;
  disabled?: boolean;
  clear: () => void;
};

const SelectClearContext = createContext<SelectClearContextValue | null>(null);

export type SelectRootProps<Value = string> = BaseSelect.Root.Props<Value, false>;

/**
 * Always mirrors value in a local context so `Select.Clear` can reset without
 * reaching into Base UI internals. Uncontrolled usage still works via `defaultValue`.
 */
function SelectRoot<Value = string>({
  value: valueProp,
  defaultValue = null as Value | null,
  onValueChange,
  disabled,
  ...props
}: SelectRootProps<Value>) {
  const [uncontrolled, setUncontrolled] = useState<Value | null>(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = (isControlled ? valueProp : uncontrolled) as Value | null;

  const handleValueChange: SelectRootProps<Value>["onValueChange"] = (next, details) => {
    if (!isControlled) setUncontrolled(next as Value | null);
    onValueChange?.(next, details);
  };

  return (
    <SelectClearContext.Provider
      value={{
        value,
        disabled,
        clear: () => handleValueChange(null as Value & null, { reason: "none" } as never),
      }}
    >
      <BaseSelect.Root
        value={value}
        disabled={disabled}
        onValueChange={handleValueChange}
        {...props}
      />
    </SelectClearContext.Provider>
  );
}

export type SelectTriggerProps = BaseSelect.Trigger.Props & {
  /** Trigger height — matches Input sizes. */
  size?: "large" | "small";
};

function SelectTrigger({ size = "large", className, ...props }: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      data-size={size}
      className={withClass("select", className)}
      {...props}
    />
  );
}

export type SelectControlProps = React.ComponentProps<"div"> & {
  size?: "large" | "small";
};

/**
 * Optional chrome around Trigger + Clear so the clear button can sit as a
 * real sibling of the trigger while sharing one bordered field.
 */
function SelectControl({ size = "large", className, ...props }: SelectControlProps) {
  return <div data-size={size} className={cn("select-control", className)} {...props} />;
}

export type SelectValueProps = BaseSelect.Value.Props;

function SelectValue({ className, ...props }: SelectValueProps) {
  return <BaseSelect.Value className={withClass("select__value", className)} {...props} />;
}

export type SelectIconProps = BaseSelect.Icon.Props;

function SelectIcon({ className, children = "expand_more", ...props }: SelectIconProps) {
  return (
    <BaseSelect.Icon
      className={withClass(["select__chevron", "material-symbols-rounded"], className)}
      {...props}
    >
      {children}
    </BaseSelect.Icon>
  );
}

export type SelectClearProps = React.ComponentProps<"button">;

/** Sibling clear control — must sit outside `Select.Trigger`, inside `Select.Root`. */
function SelectClear({ className, onClick, children = "close", ...props }: SelectClearProps) {
  const ctx = useContext(SelectClearContext);
  if (!ctx || ctx.value == null || ctx.value === "") return null;
  return (
    <button
      type="button"
      aria-label="Clear selection"
      disabled={ctx.disabled}
      className={cn("select__clear", "material-symbols-rounded", className)}
      onClick={(e) => {
        ctx.clear();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

type PositionerProps = BaseSelect.Positioner.Props;

export type SelectPopupProps = BaseSelect.Popup.Props &
  Pick<PositionerProps, "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding" | "anchor"> & {
    positionerProps?: Omit<PositionerProps, "side" | "align" | "sideOffset" | "alignOffset">;
  };

/** Portaled popup + list container. Width follows the trigger via `--anchor-width`. */
function SelectPopup({
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
}: SelectPopupProps) {
  const { className: positionerClassName, alignItemWithTrigger = false, ...restPositioner } =
    positionerProps ?? {};
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
        alignItemWithTrigger={alignItemWithTrigger}
        className={withClass("select__positioner", positionerClassName)}
        {...restPositioner}
      >
        <BaseSelect.Popup className={withClass("select__popup", className)} {...props}>
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export type SelectListProps = BaseSelect.List.Props;

function SelectList({ className, ...props }: SelectListProps) {
  return <BaseSelect.List className={withClass("select__list", className)} {...props} />;
}

export type SelectItemProps = Omit<BaseSelect.Item.Props, "children"> & {
  children?: React.ReactNode;
};

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item className={withClass("select__item", className)} {...props}>
      <BaseSelect.ItemText className="select__item-text">{children}</BaseSelect.ItemText>
      <span className="select__item-indicator" aria-hidden="true">
        <BaseSelect.ItemIndicator className="material-symbols-rounded">check</BaseSelect.ItemIndicator>
      </span>
    </BaseSelect.Item>
  );
}

export type SelectGroupProps = BaseSelect.Group.Props;
export type SelectGroupLabelProps = BaseSelect.GroupLabel.Props;
export type SelectSeparatorProps = BaseSelect.Separator.Props;

function SelectGroup({ className, ...props }: SelectGroupProps) {
  return <BaseSelect.Group className={withClass("select__group", className)} {...props} />;
}

function SelectGroupLabel({ className, ...props }: SelectGroupLabelProps) {
  return <BaseSelect.GroupLabel className={withClass("select__group-label", className)} {...props} />;
}

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return <BaseSelect.Separator className={withClass("select__separator", className)} {...props} />;
}

/**
 * Select built on Base UI. Label / helper / error come from `Field`. Compose:
 *
 *   <Field.Root>
 *     <Field.Label>Currency</Field.Label>
 *     <Select.Root items={[{ value: "xsgd", label: "XSGD" }]}>
 *       <Select.Control>
 *         <Select.Trigger>
 *           <Select.Value placeholder="Select…" />
 *           <Select.Icon />
 *         </Select.Trigger>
 *         <Select.Clear />
 *       </Select.Control>
 *       <Select.Popup>
 *         <Select.List>
 *           <Select.Item value="xsgd">XSGD</Select.Item>
 *         </Select.List>
 *       </Select.Popup>
 *     </Select.Root>
 *   </Field.Root>
 *
 * Pass `items` on Root so `Select.Value` can resolve labels before the popup mounts.
 * `Select.Clear` must be a sibling of `Select.Trigger`, not nested inside it.
 */
export const Select = {
  Root: SelectRoot,
  Control: SelectControl,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Clear: SelectClear,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItem,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
};
