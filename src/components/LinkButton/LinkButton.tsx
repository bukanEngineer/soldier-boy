import React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn, withClass } from "../../lib/cn";
import { linkButtonClasses, type LinkButtonSize } from "./styles";
import "./LinkButton.css";

export type LinkButtonProps = Omit<BaseButton.Props, "render"> & {
  /**
   * Render as a different element (e.g. `"a"`). For non-button tags this
   * renders the element directly (real link semantics). Prefer `render` from
   * Base UI when you need the Button primitive with a custom host.
   */
  as?: React.ElementType;
  /** Base UI `render` prop — custom host while keeping Button behavior */
  render?: BaseButton.Props["render"];
  /** Button size */
  size?: LinkButtonSize;
  /** Use on dark backgrounds */
  onDark?: boolean;
  /** Material Symbol name for trailing icon */
  trailingIcon?: string;
  /** Material Symbol name for leading icon */
  leadingIcon?: string;
};

function LinkButtonContent({
  leadingIcon,
  trailingIcon,
  children,
}: {
  leadingIcon?: string;
  trailingIcon?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      {leadingIcon && (
        <span className="material-symbols-rounded" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
      {trailingIcon && (
        <span className="material-symbols-rounded" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </>
  );
}

/**
 * Text-link action. Kept separate from `Button` because the chrome (no fill,
 * link color, optional icons) is distinct. Defaults to Base UI `Button`; use
 * `as="a"` for a real link without `role="button"`.
 *
 *   <LinkButton trailingIcon="arrow_forward">Learn more</LinkButton>
 *   <LinkButton as="a" href="/docs">Docs</LinkButton>
 */
export function LinkButton({
  as,
  render: renderProp,
  size = "md",
  onDark = false,
  trailingIcon,
  leadingIcon,
  type = "button",
  nativeButton,
  className,
  children,
  disabled,
  ...props
}: LinkButtonProps) {
  const content = (
    <LinkButtonContent leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
      {children}
    </LinkButtonContent>
  );
  const baseClasses = [linkButtonClasses.root, linkButtonClasses.size[size]] as const;

  // Custom host via Base UI render (keeps Button behavior / keyboard).
  if (renderProp) {
    return (
      <BaseButton
        nativeButton={nativeButton ?? false}
        render={renderProp}
        data-on-dark={onDark || undefined}
        className={withClass([...baseClasses], className)}
        disabled={disabled}
        {...props}
      >
        {content}
      </BaseButton>
    );
  }

  // Plain element (e.g. <a>) — real link semantics, no role="button".
  if (as && as !== "button") {
    const Tag = as;
    return (
      <Tag
        className={cn(...baseClasses, typeof className === "string" ? className : undefined)}
        data-on-dark={onDark || undefined}
        data-disabled={disabled || undefined}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {content}
      </Tag>
    );
  }

  return (
    <BaseButton
      type={type}
      nativeButton={nativeButton ?? true}
      data-on-dark={onDark || undefined}
      className={withClass([...baseClasses], className)}
      disabled={disabled}
      {...props}
    >
      {content}
    </BaseButton>
  );
}
