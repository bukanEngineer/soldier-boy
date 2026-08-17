/**
 * Responsive breakpoints for layout shifts.
 * Use in JS media-query listeners or in CSS via @media.
 *
 * Mobile: < 1280px
 * Desktop: >= 1280px
 */

export const BREAKPOINTS = {
  MOBILE: 360,
  DESKTOP: 1280,
} as const;

/** Shorthand media query strings for use in JS (e.g., window.matchMedia). */
export const MEDIA = {
  MOBILE: `(max-width: ${BREAKPOINTS.DESKTOP - 1}px)`,
  DESKTOP: `(min-width: ${BREAKPOINTS.DESKTOP}px)`,
} as const;
