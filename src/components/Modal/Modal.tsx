import React, { useEffect, useRef } from "react";
import "./Modal.css";

export type ModalProps = {
  /** Whether the modal is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal body content */
  children?: React.ReactNode;
  /** Footer content (buttons) */
  footer?: React.ReactNode;
  /** Modal width */
  size?: "small" | "medium" | "large";
  /** Visual variant */
  variant?: "default" | "illustration";
  /** Illustration element (shown above title) */
  illustration?: React.ReactNode;
  /** Media element */
  media?: React.ReactNode;
  /** Allow closing via overlay click / Escape */
  dismissable?: boolean;
  /** Hide the close button */
  hideClose?: boolean;
  /** Additional CSS class names */
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "small",
  variant = "default",
  illustration,
  media,
  dismissable = true,
  hideClose = false,
  className = "",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissable) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismissable, onClose]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (dismissable && e.target === dialogRef.current) onClose();
  };

  if (!open) return null;

  const cls = [
    "modal",
    `modal--${size}`,
    variant !== "default" && `modal--${variant}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <dialog ref={dialogRef} className={cls} onClick={handleBackdrop}>
      <div className="modal__container">
        {!hideClose && (
          <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
            <span className="material-symbols-rounded">close</span>
          </button>
        )}
        {illustration && <div className="modal__illustration">{illustration}</div>}
        {media && <div className="modal__media">{media}</div>}
        {title && <h2 className="modal__title">{title}</h2>}
        {children && <div className="modal__body">{children}</div>}
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </dialog>
  );
}
