import React from "react";
import { cn } from "../../lib/cn";
import { ICON_COMPONENTS, type IconName } from "./icons/registry";
import "./Icon.css";

export type { IconName };

/** An icon prop: a name from the vendored set, or any element (e.g. your own SVG). */
export type IconSource = IconName | React.ReactElement;

export type IconProps = Omit<React.ComponentProps<"svg">, "name"> & {
  /** Material Symbols (Rounded, 500) icon name, e.g. `"chevron_right"` */
  name: IconName;
  /** Icon size in pixels. Defaults to 24, or the `font-size` set by CSS */
  size?: number;
  /** Icon color. Defaults to the surrounding text color */
  color?: string;
};

/**
 * Decorative icon, drawn as inline SVG from the vendored Material Symbols set
 * (`src/assets/icons`). Always `aria-hidden`; pair with a label on the control.
 * The icon is `1em` square, so `font-size` (or the `size` prop) sizes it.
 * Unknown names render nothing.
 */
/** True when `name` is in the vendored icon set. */
export function isIconName(name: string): name is IconName {
  return Object.hasOwn(ICON_COMPONENTS, name);
}

/**
 * Renders an icon prop that is either a vendored icon name (`"close"`) or any
 * element (`<MySvg />`). Used by components that accept `icon`.
 */
export function resolveIcon(icon: IconName | React.ReactNode, props?: Omit<IconProps, "name">) {
  if (typeof icon === "string") {
    return isIconName(icon) ? <Icon name={icon} {...props} /> : null;
  }
  return icon;
}

export function Icon({ name, size, color, className, style, ...rest }: IconProps) {
  const Svg = ICON_COMPONENTS[name];
  if (!Svg) return null;
  return (
    <Svg
      data-icon={name}
      className={cn("sx-icon", className)}
      style={{ fontSize: size, color, ...style }}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  );
}
