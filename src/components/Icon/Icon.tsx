import React from "react";

export type IconProps = {
  /** Material Symbols icon name */
  name: string;
  /** Icon size in pixels */
  size?: number;
  /** Use filled variant */
  filled?: boolean;
  /** Icon color */
  color?: string;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLSpanElement>;

export function Icon({ name, size = 24, filled = false, color, className = "", style, ...rest }: IconProps) {
  return (
    <span
      className={"material-symbols-rounded " + className}
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
