import React, { useEffect } from "react";
import { createPortal } from "react-dom";
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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissable) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismissable, onClose]);

  if (!open) return null;

  const handleScrim = (e: React.MouseEvent) => {
    if (dismissable && e.target === e.currentTarget) onClose();
  };

  const cls = ["bsheet", className].filter(Boolean).join(" ");

  return createPortal(
    <div className="bsheet-scrim" onClick={handleScrim} role="dialog" aria-modal="true">
      <div className={cls}>
        <div className="bsheet__handle" />
        <div className="bsheet__head">
          {title && <h2 className="bsheet__title">{title}</h2>}
          {!hideClose && (
            <button type="button" className="bsheet__close" aria-label="Close" onClick={onClose}>
              <span className="material-symbols-rounded">close</span>
            </button>
          )}
        </div>
        {children && <div className="bsheet__body">{children}</div>}
        {footer && <div className="bsheet__foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
