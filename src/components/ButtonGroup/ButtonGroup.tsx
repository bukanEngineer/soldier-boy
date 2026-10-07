import React from "react";
import { cn } from "../../lib/cn";
import "./ButtonGroup.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupProps = React.ComponentProps<"div"> & {
  /** Layout direction */
  orientation?: ButtonGroupOrientation;
};

/**
 * Groups related buttons. Attaches sibling `Button` / `IconButton` edges
 * (shadcn-style). Separators are plain children (e.g. a `<span>`).
 *
 *   <ButtonGroup>
 *     <Button variant="secondary">Left</Button>
 *     <Button variant="secondary">Right</Button>
 *   </ButtonGroup>
 */
export function ButtonGroup({
  orientation = "horizontal",
  className,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-orientation={orientation}
      className={cn("btn-group", className)}
      {...props}
    />
  );
}
