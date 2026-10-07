export const iconButtonClasses = {
  root: "icon-btn",
  variant: {
    primary: "icon-btn--primary",
    secondary: "icon-btn--secondary",
    tertiary: "icon-btn--tertiary",
  },
  shape: {
    circle: "icon-btn--circle",
    square: "icon-btn--square",
  },
  size: {
    lg: "icon-btn--lg",
    sm: "icon-btn--sm",
  },
} as const;

export type IconButtonVariant = keyof typeof iconButtonClasses.variant;
export type IconButtonShape = keyof typeof iconButtonClasses.shape;
export type IconButtonSize = keyof typeof iconButtonClasses.size;
