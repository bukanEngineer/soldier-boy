/**
 * Responsive breakpoints for layout shifts.
 * Use in JS media-query listeners or in CSS via @media.
 */

export const BREAKPOINTS = {
  MOBILE: 360,
  TABLET: 768,
  LAPTOP: 1024,
  DESKTOP: 1240,
  EXTRA_LARGE_DESKTOP: 1440,
} as const;

/** Shorthand media query strings for use in JS (e.g., window.matchMedia). */
export const MEDIA = {
  MOBILE: `(max-width: ${BREAKPOINTS.TABLET - 1}px)`,
  TABLET: `(min-width: ${BREAKPOINTS.TABLET}px) and (max-width: ${BREAKPOINTS.LAPTOP - 1}px)`,
  LAPTOP: `(min-width: ${BREAKPOINTS.LAPTOP}px) and (max-width: ${BREAKPOINTS.DESKTOP - 1}px)`,
  DESKTOP: `(min-width: ${BREAKPOINTS.DESKTOP}px)`,
} as const;
