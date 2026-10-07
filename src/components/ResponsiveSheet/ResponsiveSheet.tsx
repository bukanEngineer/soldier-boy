import React from "react";
import { BottomSheet, type BottomSheetRootProps } from "../BottomSheet";
import { Modal, type ModalRootProps } from "../Modal";
import { useMediaQuery } from "../../lib/useMediaQuery";

/** Below this viewport width (px) the overlay is a bottom sheet; at and above it, a modal. */
const DEFAULT_BREAKPOINT = 600;

const ModeContext = React.createContext<"sheet" | "modal">("modal");

export type ResponsiveSheetRootProps = Pick<
  ModalRootProps,
  "open" | "defaultOpen" | "onOpenChange" | "onOpenChangeComplete" | "dismissable" | "children"
> & {
  /** Viewport width (px) at which the overlay switches from bottom sheet to modal. Default 600. */
  breakpoint?: number;
};

function ResponsiveSheetRoot({ breakpoint = DEFAULT_BREAKPOINT, ...props }: ResponsiveSheetRootProps) {
  const isWide = useMediaQuery(`(min-width: ${breakpoint}px)`);
  // Base UI Dialog and Drawer share the open / close contract; only the reason sets differ.
  return isWide ? (
    <ModeContext.Provider value="modal">
      <Modal.Root {...props} />
    </ModeContext.Provider>
  ) : (
    <ModeContext.Provider value="sheet">
      <BottomSheet.Root {...(props as BottomSheetRootProps)} />
    </ModeContext.Provider>
  );
}

function useIsSheet() {
  return React.useContext(ModeContext) === "sheet";
}

export type ResponsiveSheetTriggerProps = React.ComponentProps<typeof Modal.Trigger>;

function ResponsiveSheetTrigger(props: ResponsiveSheetTriggerProps) {
  return useIsSheet() ? (
    <BottomSheet.Trigger {...(props as React.ComponentProps<typeof BottomSheet.Trigger>)} />
  ) : (
    <Modal.Trigger {...props} />
  );
}

export type ResponsiveSheetPopupProps = Omit<React.ComponentProps<typeof Modal.Popup>, "portalProps"> & {
  /** Modal width when shown as a modal. Ignored for the bottom sheet. */
  size?: "small" | "large";
};

function ResponsiveSheetPopup({ size, ...props }: ResponsiveSheetPopupProps) {
  return useIsSheet() ? (
    <BottomSheet.Popup {...(props as React.ComponentProps<typeof BottomSheet.Popup>)} />
  ) : (
    <Modal.Popup size={size} {...props} />
  );
}

export type ResponsiveSheetHeaderProps = React.ComponentProps<typeof Modal.Header>;

function ResponsiveSheetHeader({ variant, ...props }: ResponsiveSheetHeaderProps) {
  return useIsSheet() ? <BottomSheet.Header {...props} /> : <Modal.Header variant={variant} {...props} />;
}

export type ResponsiveSheetTitleProps = React.ComponentProps<typeof Modal.Title>;

function ResponsiveSheetTitle(props: ResponsiveSheetTitleProps) {
  return useIsSheet() ? (
    <BottomSheet.Title {...(props as React.ComponentProps<typeof BottomSheet.Title>)} />
  ) : (
    <Modal.Title {...props} />
  );
}

export type ResponsiveSheetDescriptionProps = React.ComponentProps<typeof Modal.Description>;

function ResponsiveSheetDescription(props: ResponsiveSheetDescriptionProps) {
  return useIsSheet() ? (
    <BottomSheet.Description {...(props as React.ComponentProps<typeof BottomSheet.Description>)} />
  ) : (
    <Modal.Description {...props} />
  );
}

export type ResponsiveSheetCloseProps = React.ComponentProps<typeof Modal.Close>;

function ResponsiveSheetClose(props: ResponsiveSheetCloseProps) {
  return useIsSheet() ? (
    <BottomSheet.Close {...(props as React.ComponentProps<typeof BottomSheet.Close>)} />
  ) : (
    <Modal.Close {...props} />
  );
}

export type ResponsiveSheetBodyProps = React.ComponentProps<typeof Modal.Body>;

function ResponsiveSheetBody({ align, ...props }: ResponsiveSheetBodyProps) {
  return useIsSheet() ? (
    <BottomSheet.Body {...(props as React.ComponentProps<typeof BottomSheet.Body>)} />
  ) : (
    <Modal.Body align={align} {...props} />
  );
}

export type ResponsiveSheetFooterProps = React.ComponentProps<typeof Modal.Footer>;

function ResponsiveSheetFooter(props: ResponsiveSheetFooterProps) {
  return useIsSheet() ? <BottomSheet.Footer {...props} /> : <Modal.Footer {...props} />;
}

/**
 * One API, two presentations: a bottom sheet on narrow viewports and a centered
 * modal on wider ones (M3 and Apple both advise against full-width bottom sheets
 * on large screens). Same parts as `BottomSheet` / `Modal`:
 *
 *   <ResponsiveSheet.Root open={open} onOpenChange={setOpen}>
 *     <ResponsiveSheet.Popup>
 *       <ResponsiveSheet.Header>
 *         <ResponsiveSheet.Title>Send to</ResponsiveSheet.Title>
 *         <ResponsiveSheet.Close />
 *       </ResponsiveSheet.Header>
 *       <ResponsiveSheet.Body>…</ResponsiveSheet.Body>
 *     </ResponsiveSheet.Popup>
 *   </ResponsiveSheet.Root>
 *
 * Resizing across the breakpoint while open remounts the content, so keep form
 * state in the parent. Sheet-only features (`snapPoints`) are not available here;
 * use `BottomSheet` directly for those.
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
