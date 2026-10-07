import React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn, withClass } from "../../lib/cn";
import { guardLightDismiss } from "../../lib/dismissable";
import { IconButton } from "../IconButton";
import "./Modal.css";

export type ModalRootProps = BaseDialog.Root.Props & {
  /** Allow closing via backdrop click / Escape. Close buttons still work. */
  dismissable?: boolean;
};

function ModalRoot({
  dismissable = true,
  disablePointerDismissal,
  onOpenChange,
  ...props
}: ModalRootProps) {
  return (
    <BaseDialog.Root
      disablePointerDismissal={disablePointerDismissal ?? !dismissable}
      onOpenChange={guardLightDismiss(dismissable, onOpenChange)}
      {...props}
    />
  );
}

export type ModalTriggerProps = BaseDialog.Trigger.Props;

function ModalTrigger(props: ModalTriggerProps) {
  return <BaseDialog.Trigger {...props} />;
}

export type ModalPopupProps = BaseDialog.Popup.Props & {
  /** Modal width (Figma: small = 400, large = 600) */
  size?: "small" | "large";
  /** Props for the portal container */
  portalProps?: BaseDialog.Portal.Props;
};

/** Portal + backdrop + centering viewport + the modal panel. */
function ModalPopup({ size = "small", portalProps, className, ...props }: ModalPopupProps) {
  return (
    <BaseDialog.Portal {...portalProps}>
      <BaseDialog.Backdrop className="modal-backdrop" />
      <BaseDialog.Viewport className="modal-viewport">
        <BaseDialog.Popup data-size={size} className={withClass("modal", className)} {...props} />
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

export type ModalHeaderProps = React.ComponentProps<"div"> & {
  /**
   * `default`: title + close row with a divider. `centered`: stacked, centered
   * group (illustration / title). `toolbar`: a close-only row aligned to the end.
   */
  variant?: "default" | "centered" | "toolbar";
};

function ModalHeader({ variant = "default", className, ...props }: ModalHeaderProps) {
  return <div data-variant={variant} className={cn("modal__head", className)} {...props} />;
}

export type ModalTitleProps = BaseDialog.Title.Props;

function ModalTitle({ className, ...props }: ModalTitleProps) {
  return <BaseDialog.Title className={withClass("modal__title", className)} {...props} />;
}

export type ModalDescriptionProps = BaseDialog.Description.Props;

function ModalDescription({ className, ...props }: ModalDescriptionProps) {
  return (
    <BaseDialog.Description className={withClass("modal__description", className)} {...props} />
  );
}

export type ModalCloseProps = BaseDialog.Close.Props;

/**
 * Icon close button: a small `IconButton` with a 48px touch target. Pass
 * `render` to turn another element into a close action instead, e.g.
 * `<Modal.Close render={<Button />}>Cancel</Modal.Close>`. With only
 * `children` it renders a plain close action around them.
 */
function ModalClose({ className, render, children, ...props }: ModalCloseProps) {
  if (render) {
    return <BaseDialog.Close render={render} className={className} {...props}>{children}</BaseDialog.Close>;
  }
  if (children) {
    return (
      <BaseDialog.Close className={withClass("modal__close-text", className)} {...props}>
        {children}
      </BaseDialog.Close>
    );
  }
  return (
    <BaseDialog.Close
      className={withClass("modal__close", className)}
      render={
        <IconButton icon="close" label="Close" variant="tertiary" shape="square" size="sm" touchTarget />
      }
      {...props}
    />
  );
}

export type ModalMediaProps = React.ComponentProps<"div">;

/** Full-bleed media block (screenshot, image) at the top of a new-feature modal. */
function ModalMedia({ className, ...props }: ModalMediaProps) {
  return <div className={cn("modal__media", className)} {...props} />;
}

export type ModalIllustrationProps = React.ComponentProps<"div">;

/** Illustration slot, usually inside `<Modal.Header variant="centered">`. */
function ModalIllustration({ className, ...props }: ModalIllustrationProps) {
  return <div className={cn("modal__illustration", className)} {...props} />;
}

export type ModalBodyProps = React.ComponentProps<"div"> & {
  /** Text alignment; `center` matches the illustration / new-feature layouts */
  align?: "start" | "center";
};

function ModalBody({ align = "start", className, ...props }: ModalBodyProps) {
  return <div data-align={align} className={cn("modal__body", className)} {...props} />;
}

export type ModalFooterProps = React.ComponentProps<"div">;

function ModalFooter({ className, ...props }: ModalFooterProps) {
  return <div className={cn("modal__foot", className)} {...props} />;
}

/**
 * Modal built on Base UI Dialog (focus trap, scroll lock, Escape and
 * outside-press handled by Base UI). Compose the parts:
 *
 *   <Modal.Root open={open} onOpenChange={setOpen}>
 *     <Modal.Popup size="small">
 *       <Modal.Header>
 *         <Modal.Title>Confirm transfer</Modal.Title>
 *         <Modal.Close />
 *       </Modal.Header>
 *       <Modal.Body>…</Modal.Body>
 *       <Modal.Footer>…</Modal.Footer>
 *     </Modal.Popup>
 *   </Modal.Root>
 */
export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Popup: ModalPopup,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Close: ModalClose,
  Media: ModalMedia,
  Illustration: ModalIllustration,
  Body: ModalBody,
  Footer: ModalFooter,
};
