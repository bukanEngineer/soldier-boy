import React from "react";
import { Drawer } from "@base-ui/react/drawer";
import type {
  ModalRootProps,
  ModalHeaderProps,
  ModalTitleProps,
  ModalDescriptionProps,
  ModalCloseProps,
  ModalBodyProps,
  ModalFooterProps,
} from "../Modal/Modal";
import { IconButton } from "../IconButton";
import { cn, withClass } from "../../lib/cn";
import { guardLightDismiss, LIGHT_DISMISS_REASONS } from "../../lib/dismissable";
import { useMediaQuery } from "../../lib/useMediaQuery";
import "../BottomSheet/BottomSheet.css";
import "../Modal/Modal.css";

const DEFAULT_BREAKPOINT = 600;
const ModeContext = React.createContext<"sheet" | "modal">("modal");
const DISMISS_REASONS = new Set([...LIGHT_DISMISS_REASONS, "close-watcher", "swipe"]);

export type ResponsiveSheetRootProps = Pick<
  ModalRootProps,
  "open" | "defaultOpen" | "onOpenChangeComplete" | "dismissable" | "children"
> & {
  /** Includes the sheet's swipe and close-watcher reasons. */
  onOpenChange?: Drawer.Root.Props["onOpenChange"];
  /** Viewport width (px) at which the overlay switches to a modal. Default 600. */
  breakpoint?: number;
};

function ResponsiveSheetRoot({
  breakpoint = DEFAULT_BREAKPOINT,
  dismissable = true,
  onOpenChange,
  ...props
}: ResponsiveSheetRootProps) {
  const isWide = useMediaQuery(`(min-width: ${breakpoint}px)`);
  const guardedChange = guardLightDismiss(dismissable, onOpenChange, DISMISS_REASONS);
  return (
    <ModeContext.Provider value={isWide ? "modal" : "sheet"}>
      <Drawer.Root
        {...props}
        swipeDirection="down"
        disablePointerDismissal={!dismissable}
        onOpenChange={(open, details) => {
          // A phone gesture may still be active when the viewport widens.
          if (isWide && details.reason === "swipe") {
            details.cancel();
            return;
          }
          guardedChange(open, details);
        }}
      />
    </ModeContext.Provider>
  );
}

function useIsSheet() {
  return React.useContext(ModeContext) === "sheet";
}

export type ResponsiveSheetTriggerProps = Drawer.Trigger.Props;
function ResponsiveSheetTrigger(props: ResponsiveSheetTriggerProps) {
  return <Drawer.Trigger {...props} />;
}

export type ResponsiveSheetPopupProps = Drawer.Popup.Props & {
  /** Modal width; ignored in sheet mode. */
  size?: "small" | "large";
};
function ResponsiveSheetPopup({
  size = "small",
  className,
  children,
  ...props
}: ResponsiveSheetPopupProps) {
  const isSheet = useIsSheet();
  // Keep the provider, portal, and every rendered part stable. Only styling
  // changes at the breakpoint, preserving hook state, DOM values, and focus.
  return (
    <Drawer.VirtualKeyboardProvider>
      <Drawer.Portal>
        <Drawer.Backdrop className={isSheet ? "bsheet-backdrop" : "modal-backdrop"} />
        <Drawer.Viewport
          className={isSheet ? "bsheet-viewport" : "modal-viewport"}
          data-base-ui-swipe-ignore={isSheet ? undefined : ""}
        >
          <Drawer.Popup
            {...props}
            className={withClass(isSheet ? "bsheet" : "modal", className)}
            data-size={isSheet ? undefined : size}
            data-base-ui-swipe-ignore={isSheet ? undefined : ""}
          >
            <div className="bsheet__handle" aria-hidden="true" hidden={!isSheet} />
            {children}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.VirtualKeyboardProvider>
  );
}

export type ResponsiveSheetHeaderProps = ModalHeaderProps;
function ResponsiveSheetHeader({
  variant = "default",
  className,
  ...props
}: ResponsiveSheetHeaderProps) {
  const isSheet = useIsSheet();
  return (
    <div
      {...props}
      data-variant={isSheet ? undefined : variant}
      className={cn(isSheet ? "bsheet__head" : "modal__head", className)}
    />
  );
}

export type ResponsiveSheetTitleProps = ModalTitleProps;
function ResponsiveSheetTitle({ className, ...props }: ResponsiveSheetTitleProps) {
  return (
    <Drawer.Title
      {...props}
      className={withClass(useIsSheet() ? "bsheet__title" : "modal__title", className)}
    />
  );
}

export type ResponsiveSheetDescriptionProps = ModalDescriptionProps;
function ResponsiveSheetDescription({ className, ...props }: ResponsiveSheetDescriptionProps) {
  return (
    <Drawer.Description
      {...props}
      className={withClass(useIsSheet() ? "bsheet__description" : "modal__description", className)}
    />
  );
}

export type ResponsiveSheetCloseProps = ModalCloseProps;
function ResponsiveSheetClose({
  className,
  render,
  children,
  ...props
}: ResponsiveSheetCloseProps) {
  const isSheet = useIsSheet();
  if (render)
    return (
      <Drawer.Close {...props} render={render} className={className}>
        {children}
      </Drawer.Close>
    );
  if (children)
    return (
      <Drawer.Close
        {...props}
        className={withClass(isSheet ? "bsheet__close-text" : "modal__close-text", className)}
      >
        {children}
      </Drawer.Close>
    );
  return (
    <Drawer.Close
      {...props}
      className={withClass(isSheet ? "bsheet__close" : "modal__close", className)}
      render={
        <IconButton
          icon="close"
          label="Close"
          variant="tertiary"
          shape="square"
          size="sm"
          touchTarget
        />
      }
    />
  );
}

export type ResponsiveSheetBodyProps = ModalBodyProps;
function ResponsiveSheetBody({ align = "start", className, ...props }: ResponsiveSheetBodyProps) {
  const isSheet = useIsSheet();
  return (
    <Drawer.Content
      {...props}
      data-align={isSheet ? undefined : align}
      className={cn(isSheet ? "bsheet__body" : "modal__body", className)}
    />
  );
}

export type ResponsiveSheetFooterProps = ModalFooterProps;
function ResponsiveSheetFooter({ className, ...props }: ResponsiveSheetFooterProps) {
  return (
    <div {...props} className={cn(useIsSheet() ? "bsheet__foot" : "modal__foot", className)} />
  );
}

/**
 * Bottom sheet below the breakpoint, centered modal above it. One stable
 * Drawer tree preserves open state, form values, and focus across resizes.
 * Swipe dismissal is enabled only in sheet mode. Sheet-only snap points are
 * not available here; use BottomSheet directly for those.
 */
export const ResponsiveSheet = {
  Root: ResponsiveSheetRoot,
  Trigger: ResponsiveSheetTrigger,
  Popup: ResponsiveSheetPopup,
  Header: ResponsiveSheetHeader,
  Title: ResponsiveSheetTitle,
  Description: ResponsiveSheetDescription,
  Close: ResponsiveSheetClose,
  Body: ResponsiveSheetBody,
  Footer: ResponsiveSheetFooter,
};
