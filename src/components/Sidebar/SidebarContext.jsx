import React, { createContext, useContext } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { MEDIA } from "../../constants/breakpoints";

/**
 * @typedef {Object} SidebarContextValue
 * @property {boolean} open Whether the sidebar is expanded/visible.
 * @property {(open: boolean) => void} setOpen Controlled setter for open state.
 * @property {() => void} toggleSidebar Convenience toggle.
 * @property {boolean} isMobile Whether the viewport is below the tablet breakpoint.
 */

const SidebarContext = createContext(null);

/**
 * Provides sidebar open/collapsed state to the tree. Wrap your layout with this
 * so that both the Sidebar and any trigger (hamburger button, SidebarTrigger)
 * can share state without prop-drilling.
 *
 * @param {Object} props
 * @param {boolean} [props.defaultOpen=true] Initial open state.
 * @param {boolean} [props.open] Controlled open state (overrides internal state).
 * @param {(open: boolean) => void} [props.onOpenChange] Callback when open state changes.
 * @param {boolean} [props.responsive=true] When false, disables auto-open/close on breakpoint change (useful in iframes/docs).
 * @param {React.ReactNode} props.children
 */
export function SidebarProvider({ defaultOpen = true, open: controlledOpen, onOpenChange, responsive = true, children }) {
  const isMobile = useMediaQuery(MEDIA.MOBILE);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  // Support both controlled and uncontrolled usage
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (value) => {
      if (!isControlled) setInternalOpen(value);
      if (onOpenChange) onOpenChange(value);
    },
    [isControlled, onOpenChange]
  );

  const toggleSidebar = React.useCallback(() => setOpen(!open), [setOpen, open]);

  // Auto-close on mobile, auto-open on desktop when crossing breakpoint.
  // Intentionally syncs open state to the media-query result on breakpoint change.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (responsive) setOpen(!isMobile);
  }, [isMobile, responsive, setOpen]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar, isMobile: responsive ? isMobile : false }}>
      {children}
    </SidebarContext.Provider>
  );
}

/**
 * Access the sidebar state from anywhere inside a `<SidebarProvider>`.
 * Throws if used outside the provider.
 *
 * @returns {SidebarContextValue}
 */
export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside a <SidebarProvider>");
  return ctx;
}

/**
 * A drop-in toggle button that auto-wires to the sidebar context.
 * Place it anywhere inside a `<SidebarProvider>` (e.g., in a top bar).
 *
 * @param {Object} props
 * @param {string} [props.className] Additional CSS class names.
 * @param {string} [props.label="Toggle navigation"] Accessible label.
 */
export function SidebarTrigger({ className = "", label = "Toggle navigation" }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      className={"sidebar-trigger " + className}
      onClick={toggleSidebar}
      aria-label={label}
    >
      <span className="material-symbols-rounded" aria-hidden="true">menu</span>
    </button>
  );
}

// Export the raw context for components that need optional (non-throwing) access
export { SidebarContext };
