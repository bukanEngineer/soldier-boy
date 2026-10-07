import React from "react";
import { Alert, type AlertTone } from "../Alert/Alert";
import { cn } from "../../lib/cn";

export type ImportantNotesProps = React.ComponentProps<"div"> & {
  /** Color tone */
  tone?: AlertTone;
  /** Title text */
  title?: React.ReactNode;
};

/** Alert recipe for important callouts. */
export function ImportantNotes({
  tone = "neutral",
  title = "Important",
  children,
  className,
  ...rest
}: ImportantNotesProps) {
  return (
    <Alert tone={tone} title={title} className={cn("important-notes", className)} {...rest}>
      {children}
    </Alert>
  );
}
