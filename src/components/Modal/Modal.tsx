import React, { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  /** Hide the close button. Defaults to `true` when `dismissable` is `false` (a
   *  non-dismissable modal has no close affordance unless you opt back in). */
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
  hideClose,
  className = "",
}: ModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  // A non-dismissable modal hides the close button by default; pass
  // `hideClose={false}` explicitly to keep an X on a non-dismissable modal.
  const closeHidden = hideClose ?? !dismissable;

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissable) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismissable, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Focus management: move focus into the modal, restore on close
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement;

    requestAnimationFrame(() => {
      const modal = modalRef.current;
      if (!modal) return;
      const firstFocusable = modal.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (firstFocusable) firstFocusable.focus();
      else modal.focus();
    });

    return () => {
      previousFocusRef.current?.focus();
    };
  }, [open]);

  // Focus trap: cycle Tab within the modal
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (!open) return null;

  const handleScrim = (e: React.MouseEvent) => {
    if (dismissable && e.target === e.currentTarget) onClose();
  };

  const cls = ["modal", `modal--${size}`, className].filter(Boolean).join(" ");

  const closeBtn = !closeHidden ? (
    <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
      <span className="material-symbols-rounded">close</span>
    </button>
  ) : null;

  const titleEl = title ? <h2 id={titleId} className="modal__title">{title}</h2> : null;

  let inner: React.ReactNode;
  if (variant === "illustration") {
    // Illustration variant: icon-only header row, then illustration + title group
    inner = (
      <>
        {closeBtn && <div className="modal__head--icon-only">{closeBtn}</div>}
        <div className="modal__illustration-wrap">
          {illustration && <div className="modal__illustration">{illustration}</div>}
          {titleEl}
        </div>
        {children && <div className="modal__body--centered">{children}</div>}
        {footer && <div className="modal__foot">{footer}</div>}
      </>
    );
  } else if (variant === "new-feature") {
    // New-feature variant: media at top, title row below, centered body
    inner = (
      <>
        {closeBtn && <div className="modal__head--icon-only">{closeBtn}</div>}
        {media && <div className="modal__media">{media}</div>}
        {title && <div className="modal__title-row">{titleEl}</div>}
        {children && <div className="modal__body--centered">{children}</div>}
        {footer && <div className="modal__foot">{footer}</div>}
      </>
    );
  } else {
    // Default variant
    inner = (
      <>
        <div className="modal__head">
          {titleEl}
          {closeBtn}
        </div>
        {children && <div className="modal__body">{children}</div>}
        {footer && <div className="modal__foot">{footer}</div>}
      </>
    );
  }

  return createPortal(
    <div className="modal-scrim" onClick={handleScrim}>
      <div
        ref={modalRef}
        className={cls}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {inner}
      </div>
    </div>,
    document.body
  );
}
