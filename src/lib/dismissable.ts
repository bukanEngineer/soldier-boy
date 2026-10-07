/** Close reasons that count as "light dismiss": Escape, backdrop press, focus leaving. */
export const LIGHT_DISMISS_REASONS: ReadonlySet<string> = new Set([
  "escape-key",
  "outside-press",
  "focus-out",
]);

type CloseDetails = { reason: string; cancel: () => void };

/**
 * Builds an `onOpenChange` handler for overlays with a `dismissable` prop.
 * When `dismissable` is false, light-dismiss closes are cancelled; explicit
 * close buttons (and controlled `open` changes) still go through.
 */
export function guardLightDismiss<Details extends CloseDetails>(
  dismissable: boolean,
  onOpenChange: ((open: boolean, details: Details) => void) | undefined,
  reasons: ReadonlySet<string> = LIGHT_DISMISS_REASONS,
) {
  return (open: boolean, details: Details) => {
    if (!dismissable && !open && reasons.has(details.reason)) {
      details.cancel();
      return;
    }
    onOpenChange?.(open, details);
  };
}
