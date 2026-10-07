import React from "react";

/** Subscribes to a CSS media query. Returns `serverValue` on the server and where matchMedia is missing. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = () =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : serverValue;
  return React.useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}
