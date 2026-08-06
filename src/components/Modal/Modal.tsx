import React, { useEffect } from "react";
import { createPortal } from "react-dom";
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
  size?: "small" | "large";
  /** Visual variant */
  variant?: "default" | "illustration" | "new-feature";
  /** Illustration element (shown above title in illustration variant) */
  illustration?: React.ReactNode;
  /** Media element (shown at top in new-feature variant) */
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

  const cls = ["modal", `modal--${size}`, className].filter(Boolean).join(" ");

  const closeBtn = !hideClose ? (
    <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
      <span className="material-symbols-rounded">close</span>
    </button>
  ) : null;

  // Illustration variant: icon-only header row, then illustration + title group
  if (variant === "illustration") {
    return createPortal(
      <div className="modal-scrim" onClick={handleScrim} role="dialog" aria-modal="true">
        <div className={cls}>
          {closeBtn && <div className="modal__head--icon-only">{closeBtn}</div>}
          <div className="modal__illustration-wrap">
            {illustration && <div className="modal__illustration">{illustration}</div>}
            {title && <h2 className="modal__title">{title}</h2>}
          </div>
          {children && <div className="modal__body--centered">{children}</div>}
          {footer && <div className="modal__foot">{footer}</div>}
        </div>
      </div>,
      document.body
    );
  }

  // New-feature variant: media at top, title row below, centered body
  if (variant === "new-feature") {
    return createPortal(
      <div className="modal-scrim" onClick={handleScrim} role="dialog" aria-modal="true">
        <div className={cls}>
          {closeBtn && <div className="modal__head--icon-only">{closeBtn}</div>}
          {media && <div className="modal__media">{media}</div>}
          {title && <div className="modal__title-row"><h2 className="modal__title">{title}</h2></div>}
          {children && <div className="modal__body--centered">{children}</div>}
          {footer && <div className="modal__foot">{footer}</div>}
        </div>
      </div>,
      document.body
    );
  }

  // Default variant
  return createPortal(
    <div className="modal-scrim" onClick={handleScrim} role="dialog" aria-modal="true">
      <div className={cls}>
        <div className="modal__head">
          {title && <h2 className="modal__title">{title}</h2>}
          {closeBtn}
        </div>
        {children && <div className="modal__body">{children}</div>}
        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
