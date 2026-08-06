/**
 * Typography style utilities — typed references to CSS custom properties.
 * Mirrors straitsx-frontend's shared/TypographyStyles.ts pattern.
 */

export const FONT_FAMILY = {
  DISPLAY: "var(--font-display)",
  BODY: "var(--font-body)",
  MONO: "var(--font-mono)",
} as const;

export const FONT_WEIGHT = {
  REGULAR: 400,
  MEDIUM: 500,
  BOLD: 700,
} as const;

/**
 * Font shorthand references — use these in inline styles or JS calculations.
 * For CSS, prefer the custom property directly: `font: var(--body-medium)`.
 */
export const FONT_STYLE = {
  DISPLAY_LARGE: "var(--display-large)",
  DISPLAY_MEDIUM: "var(--display-medium)",
  DISPLAY_SMALL: "var(--display-small)",
  TITLE_LARGE: "var(--title-large)",
  TITLE_MEDIUM: "var(--title-medium)",
  TITLE_SMALL: "var(--title-small)",
  HEADLINE_LARGE: "var(--headline-large)",
  HEADLINE_MEDIUM: "var(--headline-medium)",
  HEADLINE_SMALL: "var(--headline-small)",
  LABEL_LARGE: "var(--label-large)",
  LABEL_MEDIUM: "var(--label-medium)",
  LABEL_SMALL: "var(--label-small)",
  BODY_LARGE: "var(--body-large)",
  BODY_MEDIUM: "var(--body-medium)",
  BODY_SMALL: "var(--body-small)",
  BODY_BOLD_LARGE: "var(--body-bold-large)",
  BODY_BOLD_MEDIUM: "var(--body-bold-medium)",
  BODY_BOLD_SMALL: "var(--body-bold-small)",
} as const;
