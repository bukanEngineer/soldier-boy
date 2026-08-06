/**
 * Button CSS class constants — typed mapping to Button.css class names.
 * Components import from here instead of hardcoding class strings.
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
  state: {
    hovered: "is-hovered",
    pressed: "is-pressed",
    focused: "is-focused",
  },
} as const;

export type ButtonVariant = keyof typeof buttonClasses.variant;
export type ButtonSize = keyof typeof buttonClasses.size;
