import React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { withClass } from "../../lib/cn";
import "./Menu.css";
import { Icon, type IconName } from "../Icon/Icon";

export type MenuRootProps = BaseMenu.Root.Props;
export type MenuTriggerProps = BaseMenu.Trigger.Props;

type PositionerProps = BaseMenu.Positioner.Props;

export type MenuPopupProps = BaseMenu.Popup.Props &
  Pick<PositionerProps, "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding" | "anchor"> & {
    /** Props for the Positioner wrapper (e.g. `className`, `positionMethod`) */
    positionerProps?: Omit<PositionerProps, "side" | "align" | "sideOffset" | "alignOffset">;
  };

/** Portaled, positioned popup. Defaults to opening below the trigger, start-aligned. */
function MenuPopup({
  side = "bottom",
  align = "start",
  sideOffset = 6,
  alignOffset,
  collisionPadding,
  anchor,
  positionerProps,
  className,
  ...props
}: MenuPopupProps) {
  const { className: positionerClassName, ...restPositioner } = positionerProps ?? {};
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
        className={withClass("menu__positioner", positionerClassName)}
        {...restPositioner}
      >
        {/*
         * The popup can become a scroll container when its available height is
         * constrained. Keep it keyboard-focusable so users can scroll menus
         * that do not fit in the viewport (and so automated accessibility
         * checks can identify the scroll region).
         */}
        <BaseMenu.Popup
          className={withClass("menu__popup", className)}
          tabIndex={0}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

/** Content slots shared by every item kind. */
type ItemSlots = {
  /** Icon name rendered before the label */
  icon?: IconName;
  /** Custom leading visual (e.g. an asset logo); takes precedence over `icon` */
  leading?: React.ReactNode;
  /** Supporting text under the label */
  secondary?: React.ReactNode;
  /** Trailing meta text (e.g. "Default", a timestamp) */
  trailing?: React.ReactNode;
  /** Destructive styling */
  variant?: "default" | "critical";
};

function ItemContent({
  icon,
  leading,
  secondary,
  trailing,
  children,
}: Omit<ItemSlots, "variant"> & { children?: React.ReactNode }) {
  return (
    <>
      {leading ? (
        <span className="menu__leading" aria-hidden="true">{leading}</span>
      ) : icon ? (
        <Icon name={icon} className="menu__icon" />
      ) : null}
      <span className="menu__item-text">
        <span className="menu__item-label">{children}</span>
        {secondary && <span className="menu__item-secondary">{secondary}</span>}
      </span>
      {trailing && <span className="menu__item-trailing">{trailing}</span>}
    </>
  );
}

export type MenuItemProps = Omit<BaseMenu.Item.Props, "children"> &
  ItemSlots & { children?: React.ReactNode };

function MenuItem({ icon, leading, secondary, trailing, variant = "default", className, children, ...props }: MenuItemProps) {
  return (
    <BaseMenu.Item
      data-variant={variant}
      className={withClass("menu__item", className)}
      {...props}
    >
      <ItemContent icon={icon} leading={leading} secondary={secondary} trailing={trailing}>
        {children}
      </ItemContent>
    </BaseMenu.Item>
  );
}

export type MenuRadioGroupProps = BaseMenu.RadioGroup.Props;

function MenuRadioGroup({ className, ...props }: MenuRadioGroupProps) {
  return <BaseMenu.RadioGroup className={withClass("menu__group", className)} {...props} />;
}

export type MenuRadioItemProps = Omit<BaseMenu.RadioItem.Props, "children"> &
  ItemSlots & { children?: React.ReactNode };

/** Single-select item with a trailing tick. Closes the menu on click by default. */
function MenuRadioItem({
  icon,
  leading,
  secondary,
  trailing,
  variant = "default",
  closeOnClick = true,
  className,
  children,
  ...props
}: MenuRadioItemProps) {
  return (
    <BaseMenu.RadioItem
      data-variant={variant}
      closeOnClick={closeOnClick}
      className={withClass("menu__item", className)}
      {...props}
    >
      <ItemContent icon={icon} leading={leading} secondary={secondary} trailing={trailing}>
        {children}
      </ItemContent>
      <span className="menu__check menu__check--tick" aria-hidden="true">
        <BaseMenu.RadioItemIndicator>
          <Icon name="check" />
        </BaseMenu.RadioItemIndicator>
      </span>
    </BaseMenu.RadioItem>
  );
}

export type MenuCheckboxItemProps = Omit<BaseMenu.CheckboxItem.Props, "children"> &
  ItemSlots & { children?: React.ReactNode };

/** Multi-select item with a leading checkbox. Keeps the menu open on click by default. */
function MenuCheckboxItem({
  icon,
  leading,
  secondary,
  trailing,
  variant = "default",
  className,
  children,
  ...props
}: MenuCheckboxItemProps) {
  return (
    <BaseMenu.CheckboxItem
      data-variant={variant}
      className={withClass("menu__item", className)}
      {...props}
    >
      <span className="menu__check menu__check--box" aria-hidden="true">
        <BaseMenu.CheckboxItemIndicator>
          <Icon name="check" />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      <ItemContent icon={icon} leading={leading} secondary={secondary} trailing={trailing}>
        {children}
      </ItemContent>
    </BaseMenu.CheckboxItem>
  );
}

export type MenuSeparatorProps = BaseMenu.Separator.Props;

function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <BaseMenu.Separator className={withClass("menu__separator", className)} {...props} />;
}

export type MenuGroupProps = BaseMenu.Group.Props;

function MenuGroup({ className, ...props }: MenuGroupProps) {
  return <BaseMenu.Group className={withClass("menu__group", className)} {...props} />;
}

export type MenuGroupLabelProps = BaseMenu.GroupLabel.Props;

/** Section heading. Must be inside `Menu.Group` or `Menu.RadioGroup`. */
function MenuGroupLabel({ className, ...props }: MenuGroupLabelProps) {
  return <BaseMenu.GroupLabel className={withClass("menu__group-label", className)} {...props} />;
}

/**
 * Menu built on Base UI. Compose the parts:
 *
 *   <Menu.Root>
 *     <Menu.Trigger render={<IconButton icon="more_vert" label="More" />} />
 *     <Menu.Popup>
 *       <Menu.Item icon="download" onClick={download}>Download</Menu.Item>
 *       <Menu.Separator />
 *       <Menu.Item icon="delete" variant="critical">Delete</Menu.Item>
 *     </Menu.Popup>
 *   </Menu.Root>
 */
export const Menu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Popup: MenuPopup,
  Item: MenuItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  CheckboxItem: MenuCheckboxItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
};
