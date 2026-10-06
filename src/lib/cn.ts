/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** A Base UI `className`: a string or a function of the part's state. */
export type StateClassName<State> = string | ((state: State) => string | undefined);

/**
 * Prepends design-system classes to a Base UI `className`, preserving the
 * state-function form. Pass the result straight to a Base UI part.
 */
export function withClass<State>(
  base: string | false | null | undefined | Array<string | false | null | undefined>,
  className?: StateClassName<State>,
) {
  const bases = Array.isArray(base) ? base : [base];
  return (state: State) =>
    cn(...bases, typeof className === "function" ? className(state) : className);
}
