import React, { useEffect, useRef } from "react";
import "./BottomSheet.css";

export type BottomSheetProps = {
  /** Whether the bottom sheet is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Sheet title */
  title?: string;
  /** Sheet body content */
  children?: React.ReactNode;
  /** Footer content (buttons) */
  footer?: React.ReactNode;
  /** Allow closing via overlay click / Escape */
  dismissable?: boolean;
  /** Hide the close button */
  hideClose?: boolean;
  /** Additional CSS class names */
  className?: string;
};

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  dismissable = true,
  hideClose = false,
  className = "",
}: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
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
    if (dismissable && e.target === ref.current) onClose();
  };

  if (!open) return null;

  return (
    <dialog ref={ref} className={"bottom-sheet " + className} onClick={handleBackdrop}>
      <div className="bottom-sheet__container">
        <div className="bottom-sheet__header">
          {title && <h2 className="bottom-sheet__title">{title}</h2>}
          {!hideClose && (
            <button type="button" className="bottom-sheet__close" aria-label="Close" onClick={onClose}>
              <span className="material-symbols-rounded">close</span>
            </button>
          )}
        </div>
        {children && <div className="bottom-sheet__body">{children}</div>}
        {footer && <div className="bottom-sheet__footer">{footer}</div>}
      </div>
    </dialog>
  );
}
