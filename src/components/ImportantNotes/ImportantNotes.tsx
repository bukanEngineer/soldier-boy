import React from "react";
import { Alert } from "../Alert/Alert";

export type ImportantNotesProps = {
  /** Color tone */
  tone?: "positive" | "critical" | "warning" | "info" | "neutral";
  /** Title text */
  title?: string;
  /** Notes content */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function ImportantNotes({
  tone = "neutral",
  title = "Important",
  children,
  className = "",
  ...rest
}: ImportantNotesProps) {
  return (
    <Alert tone={tone} title={title} className={"important-notes " + className} {...rest}>
      {children}
    </Alert>
  );
}
