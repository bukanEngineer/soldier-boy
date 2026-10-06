/**
 * Button CSS class constants: typed mapping to Button.css class names.
 * Interactive states are styled with :hover / :active / [data-disabled], not classes.
 */

export const buttonClasses = {
  root: "btn",
  variant: {
    primary: "btn--primary",
    secondary: "btn--secondary",
    tertiary: "btn--tertiary",
  },
  size: {
    lg: "btn--lg",
    md: "btn--md",
    sm: "btn--sm",
  },
} as const;

export type ButtonVariant = keyof typeof buttonClasses.variant;
export type ButtonSize = keyof typeof buttonClasses.size;
