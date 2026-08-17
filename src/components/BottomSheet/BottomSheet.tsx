import React, { useEffect, useId, useRef, useCallback } from "react";
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
  /** Hide the close button. Defaults to `true` when `dismissable` is `false` (a
   *  non-dismissable sheet has no close affordance unless you opt back in). */
  hideClose?: boolean;
  /** Additional CSS class names */
  className?: string;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  dismissable = true,
  hideClose,
  className = "",
}: BottomSheetProps) {
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  // A non-dismissable sheet hides the close button by default; pass
  // `hideClose={false}` explicitly to keep an X on a non-dismissable sheet.
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

  // Focus management: trap focus and restore on close
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Move focus into the sheet
    requestAnimationFrame(() => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const firstFocusable = sheet.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (firstFocusable) firstFocusable.focus();
      else sheet.focus();
    });

    return () => {
      // Restore focus to the previously focused element
      previousFocusRef.current?.focus();
    };
  }, [open]);

  // Focus trap: cycle Tab within the sheet
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const sheet = sheetRef.current;
    if (!sheet) return;

    const focusable = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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

  const cls = ["bsheet", className].filter(Boolean).join(" ");

  return createPortal(
    // Backdrop is a mouse convenience; keyboard dismissal is handled via onKeyDown on the dialog below.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="bsheet-scrim" onClick={handleScrim}>
      <div
        ref={sheetRef}
        className={cls}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="bsheet__handle" />
        <div className="bsheet__head">
          {title && <h2 id={titleId} className="bsheet__title">{title}</h2>}
          {!closeHidden && (
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
