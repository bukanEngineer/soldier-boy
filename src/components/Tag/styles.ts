export const tagClasses = {
  root: "tag",
  variant: {
    outlined: "tag--outlined",
    new: "tag--new",
  },
  tone: {
    neutral: "tag--neutral",
    positive: "tag--positive",
    critical: "tag--critical",
    warning: "tag--warning",
    info: "tag--info",
  },
  size: {
    large: "tag--large",
    small: "tag--small",
  },
  clickable: "tag--clickable",
} as const;

export type TagVariant = keyof typeof tagClasses.variant;
export type TagTone = keyof typeof tagClasses.tone;
export type TagSize = keyof typeof tagClasses.size;
