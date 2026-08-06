import React from "react";
import { badgeClasses, type BadgeTone, type BadgeSize } from "./styles";
import "./Badge.css";

export type BadgeProps = {
  /** Color tone */
  tone?: BadgeTone;
  /** Badge size */
  size?: BadgeSize;
  /** Render as a dot (no content) */
  dot?: boolean;
  /** Max number before showing "N+" */
  max?: number;
  /** Badge content (typically a number) */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export function Badge({ tone = "brand", size = "md", dot = false, max = 99, children, className = "", ...rest }: BadgeProps) {
  const cls = [
    badgeClasses.root,
    badgeClasses.size[size],
    tone !== "brand" && badgeClasses.tone[tone],
    dot && badgeClasses.dot,
    className,
  ].filter(Boolean).join(" ");
  const content = dot
    ? null
    : typeof children === "number" && children > max
      ? `${max}+`
      : children;
  return <span className={cls} {...rest}>{content}</span>;
}

export type BadgeWrapProps = {
  /** The badge element to position */
  badge: React.ReactNode;
  /** The element the badge is attached to */
  children: React.ReactNode;
};

Badge.Wrap = function BadgeWrap({ badge, children }: BadgeWrapProps) {
  return (
    <span className="badge-wrap">
      {children}
      {badge}
    </span>
  );
};
