import React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn, withClass } from "../../lib/cn";
import "./Popover.css";

export type PopoverRootProps = BasePopover.Root.Props;
export type PopoverTriggerProps = BasePopover.Trigger.Props;

type PositionerProps = BasePopover.Positioner.Props;

export type PopoverPopupProps = BasePopover.Popup.Props &
  Pick<PositionerProps, "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding" | "anchor"> & {
    positionerProps?: Omit<PositionerProps, "side" | "align" | "sideOffset" | "alignOffset" | "anchor">;
    container?: BasePopover.Portal.Props["container"];
  };

/** Portal + Positioner + Popup + Arrow. Use for rich / interactive content. */
function PopoverPopup({
  side = "top",
  align,
  sideOffset = 8,
  alignOffset,
  collisionPadding,
  anchor,
  positionerProps,
  container,
  className,
  children,
  ...props
}: PopoverPopupProps) {
  const { className: positionerClassName, ...restPositioner } = positionerProps ?? {};
  return (
    <BasePopover.Portal container={container}>
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
        className={withClass("popover__positioner", positionerClassName)}
        {...restPositioner}
      >
        <BasePopover.Popup className={withClass("popover__popup", className)} {...props}>
          <BasePopover.Arrow className="popover__arrow" />
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export type PopoverHeaderProps = React.ComponentProps<"div">;

function PopoverHeader({ className, ...props }: PopoverHeaderProps) {
  return <div className={cn("popover__header", className)} {...props} />;
}

export type PopoverTitleProps = BasePopover.Title.Props;

function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return <BasePopover.Title className={withClass("popover__title", className)} {...props} />;
}

export type PopoverDescriptionProps = BasePopover.Description.Props;

function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <BasePopover.Description className={withClass("popover__description", className)} {...props} />
  );
}

export type PopoverCloseProps = BasePopover.Close.Props;

function PopoverClose({ className, ...props }: PopoverCloseProps) {
  return <BasePopover.Close className={withClass("popover__close", className)} {...props} />;
}

export type PopoverFooterProps = React.ComponentProps<"div">;

function PopoverFooter({ className, ...props }: PopoverFooterProps) {
  return <div className={cn("popover__footer", className)} {...props} />;
}

/**
 * Popover built on Base UI. Use for rich / interactive content (title, tag,
 * links). Plain text tips belong in `Tooltip`.
 *
 *   <Popover.Root>
 *     <Popover.Trigger render={<IconButton icon="info" label="Info" />} />
 *     <Popover.Popup>
 *       <Popover.Header>
 *         <Popover.Title>Transfer limit</Popover.Title>
 *       </Popover.Header>
 *       <Popover.Description>Max S$10,000/day.</Popover.Description>
 *     </Popover.Popup>
 *   </Popover.Root>
 */
export const Popover = {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Popup: PopoverPopup,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  Footer: PopoverFooter,
  Backdrop: BasePopover.Backdrop,
  Portal: BasePopover.Portal,
  Positioner: BasePopover.Positioner,
  Arrow: BasePopover.Arrow,
};
