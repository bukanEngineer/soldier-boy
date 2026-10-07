import React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn, withClass } from "../../lib/cn";
import {
  iconButtonClasses,
  type IconButtonVariant,
  type IconButtonShape,
  type IconButtonSize,
} from "./styles";
import "./IconButton.css";

export type IconButtonProps = Omit<BaseButton.Props, "children"> & {
  /** Material Symbol icon name */
  icon: string;
  /** Visual style variant */
  variant?: IconButtonVariant;
  /** Button shape */
  shape?: IconButtonShape;
  /** Button size */
  size?: IconButtonSize;
  /** Accessible label (required for icon-only buttons) */
  label: string;
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
        ],
        className,
      )}
      {...props}
    >
      <span className={cn("material-symbols-rounded")} aria-hidden="true">
        {icon}
      </span>
    </BaseButton>
  );
}
