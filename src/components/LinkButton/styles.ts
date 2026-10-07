export const linkButtonClasses = {
  root: "link-btn",
  size: {
    lg: "link-btn--lg",
    md: "link-btn--md",
    sm: "link-btn--sm",
  },
} as const;

export type LinkButtonSize = keyof typeof linkButtonClasses.size;
