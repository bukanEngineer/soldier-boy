/**
 * Typography constants — mirrors Figma "STX - New Token" typography scale.
 * Maps to CSS custom properties defined in tokens.css.
 */

export const FONT_FAMILY = {
  DISPLAY: "var(--font-display)",
  BODY: "var(--font-body)",
  MONO: "var(--font-mono)",
} as const;

export const TYPOGRAPHY = {
  // Display — Red Hat Display Bold, fluid
  DISPLAY_LARGE: "var(--display-large)",
  DISPLAY_MEDIUM: "var(--display-medium)",
  DISPLAY_SMALL: "var(--display-small)",
  // Title — Red Hat Display Bold, fluid
  TITLE_LARGE: "var(--title-large)",
  TITLE_MEDIUM: "var(--title-medium)",
  TITLE_SMALL: "var(--title-small)",
  // Headline — Hanken Grotesk Regular, fluid
  HEADLINE_LARGE: "var(--headline-large)",
  HEADLINE_MEDIUM: "var(--headline-medium)",
  HEADLINE_SMALL: "var(--headline-small)",
  // Label — Red Hat Display Bold
  LABEL_LARGE: "var(--label-large)",
  LABEL_MEDIUM: "var(--label-medium)",
  LABEL_SMALL: "var(--label-small)",
  // Body — Hanken Grotesk Regular
  BODY_LARGE: "var(--body-large)",
  BODY_MEDIUM: "var(--body-medium)",
  BODY_SMALL: "var(--body-small)",
  // Body Bold — Hanken Grotesk Bold
  BODY_BOLD_LARGE: "var(--body-bold-large)",
  BODY_BOLD_MEDIUM: "var(--body-bold-medium)",
  BODY_BOLD_SMALL: "var(--body-bold-small)",
} as const;
