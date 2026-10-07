import React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cn, withClass } from "../../lib/cn";
import "./BottomSheet.css";

/** Close reasons that count as "light dismiss" (blocked when `dismissable` is false). */
const LIGHT_DISMISS_REASONS = new Set<string>([
  "escape-key",
  "outside-press",
  "focus-out",
  "close-watcher",
  "swipe",
]);

export type BottomSheetRootProps = BaseDrawer.Root.Props & {
  /** Allow closing via backdrop click, Escape and swipe down. Close buttons still work. */
  dismissable?: boolean;
};

function BottomSheetRoot({
  dismissable = true,
  disablePointerDismissal,
  onOpenChange,
  ...props
}: BottomSheetRootProps) {
  const handleOpenChange: BaseDrawer.Root.Props["onOpenChange"] = (open, details) => {
    if (!dismissable && !open && LIGHT_DISMISS_REASONS.has(details.reason)) {
      details.cancel();
      return;
    }
    onOpenChange?.(open, details);
  };
  return (
    <BaseDrawer.Root
      swipeDirection="down"
      disablePointerDismissal={disablePointerDismissal ?? !dismissable}
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
}

export type BottomSheetTriggerProps = BaseDrawer.Trigger.Props;

function BottomSheetTrigger(props: BottomSheetTriggerProps) {
  return <BaseDrawer.Trigger {...props} />;
}

export type BottomSheetPopupProps = BaseDrawer.Popup.Props & {
  /** Props for the portal container */
  portalProps?: BaseDrawer.Portal.Props;
};

/** Portal + backdrop + bottom-anchored viewport + the sheet panel with its drag handle. */
function BottomSheetPopup({ portalProps, className, children, ...props }: BottomSheetPopupProps) {
  return (
    <BaseDrawer.Portal {...portalProps}>
      <BaseDrawer.Backdrop className="bsheet-backdrop" />
      <BaseDrawer.Viewport className="bsheet-viewport">
        <BaseDrawer.Popup className={withClass("bsheet", className)} {...props}>
          <div className="bsheet__handle" aria-hidden="true" />
          {children}
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

export type BottomSheetHeaderProps = React.ComponentProps<"div">;

function BottomSheetHeader({ className, ...props }: BottomSheetHeaderProps) {
  return <div className={cn("bsheet__head", className)} {...props} />;
}

export type BottomSheetTitleProps = BaseDrawer.Title.Props;

function BottomSheetTitle({ className, ...props }: BottomSheetTitleProps) {
  return <BaseDrawer.Title className={withClass("bsheet__title", className)} {...props} />;
}

export type BottomSheetDescriptionProps = BaseDrawer.Description.Props;

function BottomSheetDescription({ className, ...props }: BottomSheetDescriptionProps) {
  return (
    <BaseDrawer.Description className={withClass("bsheet__description", className)} {...props} />
  );
}

export type BottomSheetCloseProps = BaseDrawer.Close.Props;

/**
 * Icon close button. Pass `render` to turn another element into a close
 * action instead, e.g. `<BottomSheet.Close render={<Button />}>Done</BottomSheet.Close>`.
 */
function BottomSheetClose({ className, render, children, ...props }: BottomSheetCloseProps) {
  if (render) {
    return (
      <BaseDrawer.Close render={render} className={className} {...props}>
        {children}
      </BaseDrawer.Close>
    );
  }
  return (
    <BaseDrawer.Close
      aria-label={children ? undefined : "Close"}
      className={withClass("bsheet__close", className)}
      {...props}
    >
      {children ?? <span className="material-symbols-rounded" aria-hidden="true">close</span>}
    </BaseDrawer.Close>
  );
}

export type BottomSheetBodyProps = BaseDrawer.Content.Props;

/** Scrollable content area. Text inside can be selected with a mouse without starting a swipe. */
function BottomSheetBody({ className, ...props }: BottomSheetBodyProps) {
  return <BaseDrawer.Content className={withClass("bsheet__body", className)} {...props} />;
}

export type BottomSheetFooterProps = React.ComponentProps<"div">;

function BottomSheetFooter({ className, ...props }: BottomSheetFooterProps) {
  return <div className={cn("bsheet__foot", className)} {...props} />;
}

/**
 * Bottom sheet built on Base UI Drawer (focus trap, scroll lock, Escape,
 * outside-press and swipe-down dismissal handled by Base UI). Compose the parts:
 *
 *   <BottomSheet.Root open={open} onOpenChange={setOpen}>
 *     <BottomSheet.Popup>
 *       <BottomSheet.Header>
 *         <BottomSheet.Title>Send to</BottomSheet.Title>
 *         <BottomSheet.Close />
 *       </BottomSheet.Header>
 *       <BottomSheet.Body>…</BottomSheet.Body>
 *       <BottomSheet.Footer>…</BottomSheet.Footer>
 *     </BottomSheet.Popup>
 *   </BottomSheet.Root>
 */
export const BottomSheet = {
  Root: BottomSheetRoot,
  Trigger: BottomSheetTrigger,
  Popup: BottomSheetPopup,
  Header: BottomSheetHeader,
  Title: BottomSheetTitle,
  Description: BottomSheetDescription,
  Close: BottomSheetClose,
  Body: BottomSheetBody,
  Footer: BottomSheetFooter,
};
