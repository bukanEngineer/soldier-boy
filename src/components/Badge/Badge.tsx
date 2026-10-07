import React from "react";
import { cn } from "../../lib/cn";
import { badgeClasses, type BadgeTone, type BadgeSize } from "./styles";
import "./Badge.css";

export type BadgeProps = React.ComponentProps<"span"> & {
  /** Color tone */
  tone?: BadgeTone;
  /** Badge size */
  size?: BadgeSize;
  /** Render as a dot (no content) */
  dot?: boolean;
  /** Max number before showing "N+" */
  max?: number;
};

/**
 * Counter / notification badge. Wrap a host with `Badge.Wrap`.
 *
 *   <Badge>3</Badge>
 *   <Badge.Wrap badge={<Badge tone="critical" dot />}>
 *     <IconButton icon="notifications" label="Notifications" />
 *   </Badge.Wrap>
 */
export function Badge({
  tone = "brand",
  size = "md",
  dot = false,
  max = 99,
  children,
  className,
  ...rest
}: BadgeProps) {
  const content =
    dot ? null : typeof children === "number" && children > max ? `${max}+` : children;

  return (
    <span
      className={cn(
        badgeClasses.root,
        badgeClasses.size[size],
        tone !== "brand" && badgeClasses.tone[tone],
        dot && badgeClasses.dot,
        className,
      )}
      data-dot={dot || undefined}
      data-tone={tone !== "brand" ? tone : undefined}
      {...rest}
    >
      {content}
    </span>
  );
}

export type BadgeWrapProps = React.ComponentProps<"span"> & {
  /** The badge element to position */
  badge: React.ReactNode;
};

function BadgeWrap({ badge, children, className, ...props }: BadgeWrapProps) {
  return (
    <span className={cn(badgeClasses.wrap, className)} {...props}>
      {children}
      {badge}
    </span>
  );
}

Badge.Wrap = BadgeWrap;
