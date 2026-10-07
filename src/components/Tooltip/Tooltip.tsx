import React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { withClass } from "../../lib/cn";
import "./Tooltip.css";

export type TooltipProviderProps = BaseTooltip.Provider.Props;
export type TooltipRootProps = BaseTooltip.Root.Props;

/** Renders a `<button>` by default; pass `render` to use any element as the trigger. */
export type TooltipTriggerProps = BaseTooltip.Trigger.Props;

type PositionerProps = Pick<
  BaseTooltip.Positioner.Props,
  "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding" | "anchor"
>;

export type TooltipPopupProps = BaseTooltip.Popup.Props &
  PositionerProps & {
    /** Container to portal into (defaults to `document.body`) */
    container?: BaseTooltip.Portal.Props["container"];
  };

/**
 * Portal + Positioner + Popup + Arrow in one part. Positioning props
 * (`side`, `align`, `sideOffset`, ...) go to the positioner; the rest go to
 * the popup element.
 */
function TooltipPopup({
  side = "top",
  align,
  sideOffset = 8,
  alignOffset,
  collisionPadding,
  anchor,
  container,
  className,
  children,
  ...props
}: TooltipPopupProps) {
  return (
    <BaseTooltip.Portal container={container}>
      <BaseTooltip.Positioner
        className="tooltip__positioner"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
      >
        <BaseTooltip.Popup className={withClass("tooltip__popup", className)} {...props}>
          <BaseTooltip.Arrow className="tooltip__arrow" />
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

/**
 * Tooltip built on Base UI. Plain, non-interactive content only; use
 * `Popover` for titles, tags or links.
 *
 *   <Tooltip.Root>
 *     <Tooltip.Trigger render={<IconButton icon="info" label="Transfer limit" />} />
 *     <Tooltip.Popup side="top">Max S$10,000/day.</Tooltip.Popup>
 *   </Tooltip.Root>
 *
 * Wrap a group of tooltips in `Tooltip.Provider` to share open/close delays.
 */
export const Tooltip = {
  Provider: BaseTooltip.Provider,
  Root: BaseTooltip.Root,
  Trigger: BaseTooltip.Trigger,
  Popup: TooltipPopup,
};
