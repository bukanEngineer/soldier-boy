export const inputClasses = {
  root: "input",
  size: {
    large: "input--large",
    small: "input--small",
  },
  state: {
    error: "is-error",
    disabled: "is-disabled",
    hovered: "is-hovered",
    focused: "is-focused",
  },
  withButton: "input--with-button",
} as const;

export type InputSize = keyof typeof inputClasses.size;
