import React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { withClass } from "../../lib/cn";
import { buttonClasses, type ButtonVariant, type ButtonSize } from "./styles";
import "./Button.css";

export type ButtonProps = BaseButton.Props & {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button height */
  size?: ButtonSize;
};

/**
 * Button built on Base UI's Button. Use `render` to render as another element,
 * e.g. `<Button render={<a href="/" />} nativeButton={false}>Home</Button>`.
 */
export function Button({
  variant = "primary",
  size = "lg",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      type={type}
      className={withClass(
        [buttonClasses.root, buttonClasses.variant[variant], buttonClasses.size[size]],
        className,
      )}
      {...props}
    />
  );
}
