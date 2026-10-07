import React from "react";
import { cn } from "../../lib/cn";
import "./Icon.css";

export type IconProps = React.ComponentProps<"span"> & {
  /** Material Symbols icon name */
  name: string;
  /** Icon size in pixels */
  size?: number;
  /** Use filled variant */
  filled?: boolean;
  /** Icon color */
  color?: string;
};

/** Decorative Material Symbols glyph. Always `aria-hidden`; pair with a label on the control. */
export function Icon({
  name,
  size = 24,
  filled = false,
  color,
  className,
  style,
  ...rest
}: IconProps) {
  return (
    <span
      className={cn("material-symbols-rounded", className)}
      style={{
        fontSize: size,
        color,
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
        ...style,
      }}
      aria-hidden="true"
      {...rest}
    >
      {name}
    </span>
  );
}
