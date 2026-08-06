import React from "react";
import "./Card.css";

export type CardProps = {
  /** Shadow elevation level (1-3) or false for none */
  shadow?: false | 1 | 2 | 3;
  /** Additional CSS class names */
  className?: string;
  /** Card title */
  title?: string;
  /** Card body text */
  body?: string;
  /** Card content */
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export function Card({ shadow = false, className = "", title, body, children, ...rest }: CardProps) {
  const cls = [
    "card",
    shadow && `card--shadow-${shadow}`,
    className,
  ].filter(Boolean).join(" ");
  return (
    <section className={cls} {...rest}>
      {title && <h3 className="card__title">{title}</h3>}
      {body && <p className="card__body">{body}</p>}
      {children}
    </section>
  );
}
