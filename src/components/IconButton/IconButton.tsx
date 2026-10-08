import React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { withClass } from "../../lib/cn";
import {
  iconButtonClasses,
  type IconButtonVariant,
  type IconButtonShape,
  type IconButtonSize,
} from "./styles";
import "./IconButton.css";
import { resolveIcon, type IconSource } from "../Icon/Icon";

export type IconButtonProps = Omit<BaseButton.Props, "children"> & {
  /** Icon name, or your own icon element */
  icon: IconSource;
  /** Visual style variant */
  variant?: IconButtonVariant;
  /** Button shape */
  shape?: IconButtonShape;
  /** Button size */
  size?: IconButtonSize;
  /** Accessible label (required for icon-only buttons) */
  label: string;
  /**
   * Extend the tap area to 48x48 without changing the visual size or layout.
   * Use for small buttons on touch screens; `lg` is already 48px, so it has no effect there.
   */
  touchTarget?: boolean;
};

/**
 * Icon-only button built on Base UI `Button`. Kept as a separate export from
 * `Button` because it requires an accessible `label` and shape sizing.
 *
 *   <IconButton icon="close" label="Close" variant="tertiary" />
 */
export function IconButton({
  icon,
  variant = "tertiary",
  shape = "circle",
  size = "lg",
  label,
  touchTarget = false,
  type = "button",
  className,
  ...props
}: IconButtonProps) {
  return (
    <BaseButton
      type={type}
      aria-label={label}
      className={withClass(
        [
          iconButtonClasses.root,
          iconButtonClasses.variant[variant],
          iconButtonClasses.shape[shape],
          iconButtonClasses.size[size],
          touchTarget && iconButtonClasses.touchTarget,
        ],
        className,
      )}
      {...props}
    >
      {resolveIcon(icon)}
    </BaseButton>
  );
}
