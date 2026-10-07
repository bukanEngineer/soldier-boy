export const inputClasses = {
  root: "input",
  size: {
    large: "input--large",
    small: "input--small",
  },
  withButton: "input--with-button",
} as const;

export type InputSize = keyof typeof inputClasses.size;
