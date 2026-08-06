export const badgeClasses = {
  root: "badge",
  size: {
    lg: "badge--lg",
    md: "",
    sm: "badge--sm",
  },
  tone: {
    brand: "",
    critical: "badge--critical",
    warning: "badge--warning",
    info: "badge--info",
    neutral: "badge--neutral",
  },
  dot: "badge--dot",
  wrap: "badge-wrap",
} as const;

export type BadgeTone = keyof typeof badgeClasses.tone;
export type BadgeSize = keyof typeof badgeClasses.size;
