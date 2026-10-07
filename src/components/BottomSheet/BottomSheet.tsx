import React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cn, withClass } from "../../lib/cn";
import { LIGHT_DISMISS_REASONS, guardLightDismiss } from "../../lib/dismissable";
import { IconButton } from "../IconButton";
import "./BottomSheet.css";

/** Light dismiss for a sheet also includes swipe-down and the Android back gesture. */
const SHEET_DISMISS_REASONS: ReadonlySet<string> = new Set([
  ...LIGHT_DISMISS_REASONS,
  "close-watcher",
  "swipe",
]);

/** Lets the popup know the sheet has detents, so it can size itself for them. */
const SnapPointsContext = React.createContext(false);

export type BottomSheetRootProps = Omit<BaseDrawer.Root.Props, "swipeDirection"> & {
  /** Allow closing via backdrop click, Escape and swipe down. Close buttons still work. */
  dismissable?: boolean;
};

/**
 * `snapPoints` gives the sheet detents: fractions of the viewport height
 * (`0.5`), pixels (`320`) or CSS lengths (`"20rem"`), e.g. `[0.5, 1]` for
 * half height that can be dragged up to full height.
 */
function BottomSheetRoot({
  dismissable = true,
  disablePointerDismissal,
  onOpenChange,
  ...props
}: BottomSheetRootProps) {
  return (
    <SnapPointsContext.Provider value={Boolean(props.snapPoints?.length)}>
      <BaseDrawer.Root
        swipeDirection="down"
        disablePointerDismissal={disablePointerDismissal ?? !dismissable}
        onOpenChange={guardLightDismiss(dismissable, onOpenChange, SHEET_DISMISS_REASONS)}
        {...props}
      />
    </SnapPointsContext.Provider>
  );
}

export type BottomSheetTriggerProps = BaseDrawer.Trigger.Props;

function BottomSheetTrigger(props: BottomSheetTriggerProps) {
  return <BaseDrawer.Trigger {...props} />;
}

export type BottomSheetPopupProps = BaseDrawer.Popup.Props & {
  /** Props for the portal container */
  portalProps?: BaseDrawer.Portal.Props;
  /**
   * Lift the sheet above the on-screen keyboard and scroll the focused field
   * into view. Turn off for sheets with no text input.
   */
  keyboardAware?: boolean;
};

/** Portal + backdrop + bottom-anchored viewport + the sheet panel with its drag handle. */
function BottomSheetPopup({
  portalProps,
  keyboardAware = true,
  className,
  children,
  ...props
}: BottomSheetPopupProps) {
  const hasSnapPoints = React.useContext(SnapPointsContext);
  const portal = (
    <BaseDrawer.Portal {...portalProps}>
      <BaseDrawer.Backdrop className="bsheet-backdrop" />
      <BaseDrawer.Viewport className="bsheet-viewport">
        <BaseDrawer.Popup
          data-snap-points={hasSnapPoints || undefined}
          className={withClass("bsheet", className)}
          {...props}
        >
          <div className="bsheet__handle" aria-hidden="true" />
          {children}
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
  return keyboardAware ? (
    <BaseDrawer.VirtualKeyboardProvider>{portal}</BaseDrawer.VirtualKeyboardProvider>
  ) : (
    portal
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
 * Icon close button: a small (36px) `IconButton` with a 48px touch target
 * (`touchTarget`), so the header stays compact without a tiny tap area.
 * Pass `render` to turn another element into a close action instead, e.g.
 * `<BottomSheet.Close render={<Button />}>Done</BottomSheet.Close>`. With only
 * `children` it renders a plain text close action.
 */
function BottomSheetClose({ className, render, children, ...props }: BottomSheetCloseProps) {
  if (render) {
    return (
      <BaseDrawer.Close render={render} className={className} {...props}>
        {children}
      </BaseDrawer.Close>
    );
  }
  if (children) {
    return (
      <BaseDrawer.Close className={withClass("bsheet__close-text", className)} {...props}>
        {children}
      </BaseDrawer.Close>
    );
  }
  return (
    <BaseDrawer.Close
      className={withClass("bsheet__close", className)}
      render={<IconButton icon="close" label="Close" variant="tertiary" size="sm" touchTarget />}
      {...props}
    />
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
