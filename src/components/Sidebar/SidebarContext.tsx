import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { MEDIA } from "../../constants/breakpoints";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon/Icon";

export type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export type SidebarProviderProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When false, disables auto-open/close on breakpoint change */
  responsive?: boolean;
  children?: React.ReactNode;
};

export function SidebarProvider({
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  responsive = true,
  children,
}: SidebarProviderProps) {
  const isMobile = useMediaQuery(MEDIA.MOBILE);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  const toggleSidebar = useCallback(() => setOpen(!open), [setOpen, open]);

  useEffect(() => {
    // Intentionally syncs open state to the media-query result on breakpoint change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (responsive) setOpen(!isMobile);
  }, [isMobile, responsive, setOpen]);

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, toggleSidebar, isMobile: responsive ? isMobile : false }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside a <SidebarProvider>");
  return ctx;
}

export type SidebarTriggerProps = React.ComponentProps<"button"> & {
  label?: string;
};

export function SidebarTrigger({
  className,
  label = "Toggle navigation",
  type = "button",
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type={type}
      className={cn("sidebar-trigger", className)}
      onClick={toggleSidebar}
      aria-label={label}
      {...props}
    >
      <Icon name="menu" />
    </button>
  );
}

export { SidebarContext };
