import React from "react";
import "./ErrorResponse.css";

export type ErrorResponseProps = {
  /** Error code (e.g., "404") */
  code?: string;
  /** Error title */
  title?: string;
  /** Error body text */
  body?: string;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
};

export function ErrorResponse({ code, title, body, actions, className = "" }: ErrorResponseProps) {
  return (
    <section className={"error " + className} role="alert">
      {code && <div className="error__code">{code}</div>}
      {title && <div className="error__title">{title}</div>}
      {body && <div className="error__body">{body}</div>}
      {actions && <div className="error__actions">{actions}</div>}
    </section>
  );
}
