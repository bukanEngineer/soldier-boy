import React, { createContext, useContext, useMemo } from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn, withClass } from "../../lib/cn";
import "./Toast.css";

export type ToastTone = "positive" | "critical" | "warning" | "info";

const ICONS: Record<ToastTone, string> = {
  positive: "check_circle",
  critical: "error",
  warning: "warning",
  info: "info",
};

const MIN_DURATION = 3000;
const MAX_DURATION = 7000;
/** Auto-dismiss is kept between 3s and 7s; `0` keeps the toast until dismissed. */
const clampDuration = (ms: number) =>
  ms === 0 ? 0 : Math.min(MAX_DURATION, Math.max(MIN_DURATION, ms));

/* ─────────── Parts ─────────── */

const ToneContext = createContext<ToastTone>("positive");

const toneOf = (type: string | undefined): ToastTone =>
  type && type in ICONS ? (type as ToastTone) : "positive";

export type ToastRootProps = BaseToast.Root.Props;

/** One toast. Pass the toast object from `useToast().toasts` or `renderToast`. */
function ToastRoot({ className, ...props }: ToastRootProps) {
  return (
    <ToneContext.Provider value={toneOf(props.toast.type)}>
      <BaseToast.Root className={withClass("toast", className)} {...props} />
    </ToneContext.Provider>
  );
}

export type ToastIconProps = React.ComponentProps<"span">;

/** Tone icon (decorative). Pass children to use a different Material Symbol. */
function ToastIcon({ className, children, ...props }: ToastIconProps) {
  const tone = useContext(ToneContext);
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-rounded", "toast__icon", className)}
      {...props}
    >
      {children ?? ICONS[tone]}
    </span>
  );
}

export type ToastTitleProps = BaseToast.Title.Props;

/** Accessible title. Visually hidden: the design shows the description only. */
function ToastTitle({ className, ...props }: ToastTitleProps) {
  return <BaseToast.Title className={withClass("toast__title", className)} {...props} />;
}

export type ToastDescriptionProps = BaseToast.Description.Props;

function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  return (
    <BaseToast.Description className={withClass("toast__description", className)} {...props} />
  );
}

export type ToastActionProps = BaseToast.Action.Props;

/** Action button. Renders only when it has content (children or the toast's `action`). */
function ToastAction({ className, ...props }: ToastActionProps) {
  return <BaseToast.Action className={withClass("toast__action", className)} {...props} />;
}

export type ToastCloseProps = BaseToast.Close.Props;

function ToastClose({ className, children, ...props }: ToastCloseProps) {
  return (
    <BaseToast.Close
      aria-label="Dismiss"
      className={withClass("toast__close", className)}
      {...props}
    >
      {children ?? (
        <span className="material-symbols-rounded" aria-hidden="true">close</span>
      )}
    </BaseToast.Close>
  );
}

/**
 * Toast parts, for custom rendering via `ToastProvider`'s `renderToast`:
 *
 *   <Toast.Root toast={toast}>
 *     <Toast.Icon />
 *     <Toast.Title />
 *     <Toast.Description />
 *     <Toast.Action />
 *     <Toast.Close />
 *   </Toast.Root>
 */
export const Toast = {
  Root: ToastRoot,
  Icon: ToastIcon,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
};

/* ─────────── useToast API ─────────── */

export type ToastData = {
  /** Show a close button */
  dismissible?: boolean;
};

export type ToastObject = BaseToast.Root.ToastObject<ToastData>;

export type ToastOptions = {
  /** Reuse an id to update an existing toast in place */
  id?: string;
  /** Accessible title (announced, visually hidden) */
  title?: React.ReactNode;
  /** Message shown in the toast */
  description?: React.ReactNode;
  tone?: ToastTone;
  /** Auto-dismiss delay in ms, clamped to 3000-7000. `0` disables auto-dismiss. */
  timeout?: number;
  /** Trailing action button */
  action?: {
    label: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  /** Show a close button */
  dismissible?: boolean;
  /** Called when the toast starts closing */
  onClose?: () => void;
};

export type ToastApi = {
  /** Shows a toast and returns its id */
  add: (options: ToastOptions) => string;
  /** Updates an open toast */
  update: (id: string, options: Partial<Omit<ToastOptions, "id">>) => void;
  /** Closes one toast, or all toasts when no id is given */
  close: (id?: string) => void;
};

function toBaseOptions(options: Partial<ToastOptions>) {
  const { id, tone, timeout, action, dismissible, ...rest } = options;
  return {
    ...(id !== undefined && { id }),
    ...rest,
    ...(tone !== undefined && {
      type: tone,
      // Critical toasts are announced assertively; others are polite.
      priority: tone === "critical" ? ("high" as const) : ("low" as const),
    }),
    ...(timeout !== undefined && { timeout: clampDuration(timeout) }),
    ...(action !== undefined && {
      actionProps: { children: action.label, onClick: action.onClick },
    }),
    ...(dismissible !== undefined && { data: { dismissible } }),
  };
}

const ToastApiContext = createContext<ToastApi | null>(null);

function ToastApiBridge({ children }: { children: React.ReactNode }) {
  const { add, update, close } = BaseToast.useToastManager<ToastData>();
  // Only the stable store methods are used, so consumers don't re-render on every toast.
  const api = useMemo<ToastApi>(
    () => ({
      add: ({ tone = "positive", ...options }) => add(toBaseOptions({ tone, ...options })),
      update: (id, options) => update(id, toBaseOptions(options)),
      close,
    }),
    [add, update, close],
  );
  return <ToastApiContext.Provider value={api}>{children}</ToastApiContext.Provider>;
}

function DefaultToast({ toast }: { toast: ToastObject }) {
  return (
    <ToastRoot toast={toast}>
      <ToastIcon />
      <div className="toast__body">
        <ToastTitle />
        <ToastDescription />
      </div>
      <ToastAction />
      {toast.data?.dismissible && <ToastClose />}
    </ToastRoot>
  );
}

function ToastList({ renderToast }: { renderToast: (toast: ToastObject) => React.ReactNode }) {
  const { toasts } = BaseToast.useToastManager<ToastData>();
  return toasts.map((toast) => <React.Fragment key={toast.id}>{renderToast(toast)}</React.Fragment>);
}

export type ToastProviderProps = {
  children?: React.ReactNode;
  /** Default auto-dismiss delay in ms (clamped to 3000-7000) */
  timeout?: number;
  /** Toasts visible at once. Older ones are hidden when exceeded. */
  limit?: number;
  /** Custom toast renderer, built from the `Toast.*` parts */
  renderToast?: (toast: ToastObject) => React.ReactNode;
  /** Props for the viewport (the fixed "Notifications" region) */
  viewportProps?: BaseToast.Viewport.Props;
};

/**
 * Wrap the app once. Toasts render in a portaled, fixed viewport at the top
 * center; F6 moves focus into it. Trigger them with `useToast()`.
 */
export function ToastProvider({
  children,
  timeout = 5000,
  limit = 1,
  renderToast = (toast) => <DefaultToast toast={toast} />,
  viewportProps,
}: ToastProviderProps) {
  const { className, ...restViewportProps } = viewportProps ?? {};
  return (
    <BaseToast.Provider timeout={clampDuration(timeout)} limit={limit}>
      <ToastApiBridge>{children}</ToastApiBridge>
      <BaseToast.Portal>
        <BaseToast.Viewport className={withClass("toast-region", className)} {...restViewportProps}>
          <ToastList renderToast={renderToast} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

/**
 * Returns the toast API. Must be called inside `<ToastProvider>`.
 *
 *   const toast = useToast();
 *   toast.add({ tone: "positive", description: "Saved" });
 */
export function useToast(): ToastApi {
  const api = useContext(ToastApiContext);
  if (!api) throw new Error("useToast must be used inside a <ToastProvider>");
  return api;
}

/** Like `useToast`, but returns `null` outside a provider (for components where toasts are optional). */
export function useOptionalToast(): ToastApi | null {
  return useContext(ToastApiContext);
}
