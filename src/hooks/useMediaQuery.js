import { useState, useEffect } from "react";

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * Updates reactively when the viewport crosses the breakpoint.
 *
 * @param {string} query - A valid media query string, e.g. `"(max-width: 767px)"`.
 * @returns {boolean} Whether the media query currently matches.
 *
 * @example
 * import { MEDIA } from "../constants/breakpoints";
 * const isMobile = useMediaQuery(MEDIA.MOBILE);
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
