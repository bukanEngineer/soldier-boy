import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { useOptionalToast } from "../Toast/Toast";
import "./Copybox.css";

export type CopyboxProps = Omit<React.ComponentProps<"div">, "children" | "onCopy"> & {
  /** Value shown and copied */
  value?: string;
  /** Multiline layout (wraps long values) */
  multiline?: boolean;
  /** Size variant */
  size?: "large" | "sm";
  /** Error border. Inside `<Field.Root invalid>` this is picked up automatically. */
  invalid?: boolean;
  /** Show the copy button */
  action?: boolean;
  /** Copy button style */
  buttonVariant?: "text" | "icon";
  /** Leading element (bank logo, blockchain mark, Material Symbol) */
  leading?: React.ReactNode;
  /** Middle-truncate values longer than 20 characters */
  truncate?: boolean;
  /** Called after the value was copied */
  onCopy?: (value: string) => void;
};

/**
 * Read-only value with a copy button. Shows a "Copied" toast when rendered
 * inside `<ToastProvider>`. Label, helper and error come from `Field`:
 *
 *   <Field.Root>
 *     <Field.Label nativeLabel={false} render={<div />}>Wallet address</Field.Label>
 *     <Copybox value={address} />
 *   </Field.Root>
 */
export function Copybox({
  value = "",
  multiline = false,
  size = "large",
  invalid,
  action = true,
  buttonVariant = "text",
  leading,
  truncate = false,
  onCopy,
  className,
  ...props
}: CopyboxProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toast = useOptionalToast();
  const iconOnly = buttonVariant === "icon";

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return; /* clipboard unavailable */
    }
    setCopied(true);
    toast?.add({ tone: "positive", description: "Copied" });
    onCopy?.(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  const doTruncate = truncate && !multiline && value.length > 20;

  return (
    <div
      className={cn("copybox", className)}
      data-size={size}
      data-multiline={multiline || undefined}
      data-action={action || undefined}
      data-invalid={invalid || undefined}
      data-copied={copied || undefined}
      {...props}
    >
      <div className="copybox__body">
        {leading && <span className="copybox__lead" aria-hidden="true">{leading}</span>}
        <span className="copybox__value" title={doTruncate ? value : undefined}>
          {doTruncate ? (
            <>
              <span className="copybox__trunc-start">{value.slice(0, 10)}</span>
              <span className="copybox__trunc-ellipsis" aria-hidden="true">…</span>
              <span className="copybox__trunc-end">{value.slice(-8)}</span>
            </>
          ) : (
            value
          )}
        </span>
      </div>
      {action && (
        <button
          type="button"
          className="copybox__btn"
          onClick={copy}
          aria-label={iconOnly ? (copied ? "Copied" : "Copy") : undefined}
        >
          <span className="material-symbols-rounded" aria-hidden="true">
            {copied ? "check" : "content_copy"}
          </span>
          {!iconOnly && (copied ? "Copied" : "Copy")}
        </button>
      )}
    </div>
  );
}
