export const selectClasses = {
  root: "select",
  size: {
    large: "select--large",
    small: "select--small",
  },
  state: {
    error: "is-error",
    disabled: "is-disabled",
  },
  menu: "select-menu",
} as const;

export type SelectSize = keyof typeof selectClasses.size;
