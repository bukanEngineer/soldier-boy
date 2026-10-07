import React from "react";
import { cn } from "../../lib/cn";
import "./Card.css";

export type CardShadow = false | 1 | 2 | 3;

export type CardProps = React.ComponentProps<"section"> & {
  /** Shadow elevation (1–3), or `false` for none */
  shadow?: CardShadow;
};

/** Surface container. Compose with `CardHeader` / `CardTitle` / `CardContent` / `CardFooter`. */
export function Card({ shadow = false, className, ...props }: CardProps) {
  return (
    <section
      data-shadow={shadow || undefined}
      className={cn("card", className)}
      {...props}
    />
  );
}

export type CardHeaderProps = React.ComponentProps<"div">;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("card__header", className)} {...props} />;
}

export type CardTitleProps = React.ComponentProps<"h3">;

export function CardTitle({ className, ...props }: CardTitleProps) {
  // Content comes from `children` via props; empty headings are a consumer mistake.
  // eslint-disable-next-line jsx-a11y/heading-has-content -- compound part
  return <h3 className={cn("card__title", className)} {...props} />;
}

export type CardDescriptionProps = React.ComponentProps<"p">;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn("card__description", className)} {...props} />;
}

export type CardContentProps = React.ComponentProps<"div">;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("card__content", className)} {...props} />;
}

export type CardFooterProps = React.ComponentProps<"div">;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn("card__footer", className)} {...props} />;
}
