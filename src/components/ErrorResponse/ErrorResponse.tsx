import React from "react";
import { cn } from "../../lib/cn";
import "./ErrorResponse.css";

export type ErrorResponseProps = React.ComponentProps<"section"> & {
  /** Error code (e.g. "404") */
  code?: React.ReactNode;
  /** Error title — prefer `<ErrorResponseTitle>` as a child */
  title?: React.ReactNode;
  /** Error body — prefer `<ErrorResponseDescription>` as a child */
  description?: React.ReactNode;
  /** Action buttons — prefer `<ErrorResponseActions>` as a child */
  actions?: React.ReactNode;
};

export type ErrorResponseCodeProps = React.ComponentProps<"div">;
export function ErrorResponseCode({ className, ...props }: ErrorResponseCodeProps) {
  return <div className={cn("error__code", className)} {...props} />;
}

export type ErrorResponseTitleProps = React.ComponentProps<"div">;
export function ErrorResponseTitle({ className, ...props }: ErrorResponseTitleProps) {
  return <div className={cn("error__title", className)} {...props} />;
}

export type ErrorResponseDescriptionProps = React.ComponentProps<"div">;
export function ErrorResponseDescription({ className, ...props }: ErrorResponseDescriptionProps) {
  return <div className={cn("error__body", className)} {...props} />;
}

export type ErrorResponseActionsProps = React.ComponentProps<"div">;
export function ErrorResponseActions({ className, ...props }: ErrorResponseActionsProps) {
  return <div className={cn("error__actions", className)} {...props} />;
}

/**
 * Full-page / panel error state.
 *
 *   <ErrorResponse>
 *     <ErrorResponseCode>404</ErrorResponseCode>
 *     <ErrorResponseTitle>Page not found</ErrorResponseTitle>
 *     <ErrorResponseDescription>Check the URL and try again.</ErrorResponseDescription>
 *   </ErrorResponse>
 */
export function ErrorResponse({
  code,
  title,
  description,
  actions,
  className,
  children,
  ...props
}: ErrorResponseProps) {
  return (
    <section className={cn("error", className)} role="alert" {...props}>
      {code != null && <ErrorResponseCode>{code}</ErrorResponseCode>}
      {title != null && <ErrorResponseTitle>{title}</ErrorResponseTitle>}
      {description != null && (
        <ErrorResponseDescription>{description}</ErrorResponseDescription>
      )}
      {actions != null && <ErrorResponseActions>{actions}</ErrorResponseActions>}
      {children}
    </section>
  );
}
