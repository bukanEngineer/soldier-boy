import React from "react";
import { cn } from "../../lib/cn";
import type { ButtonVariant } from "../Button/styles";
import "./ButtonGroup.css";

/** Lower rank = less emphasis = placed further left. */
const VARIANT_RANK: Record<ButtonVariant, number> = { tertiary: 0, secondary: 1, primary: 2 };

export type ButtonGroupProps = Omit<React.ComponentProps<"div">, "children"> & {
  /**
   * Exactly two `Button`s: `secondary` + `primary`, or `tertiary` + `secondary`.
   * Rendered least to most prominent, so the primary action sits on the right.
   */
  children: [React.ReactElement, React.ReactElement];
};

function rankOf(child: React.ReactElement) {
  const { variant = "primary" } = child.props as { variant?: ButtonVariant };
  return VARIANT_RANK[variant] ?? VARIANT_RANK.primary;
}

/**
 * A pair of related actions, 12px apart. The more prominent button is always
 * on the right, whatever order the children are passed in:
 *
 *   <ButtonGroup>
 *     <Button variant="secondary">Cancel</Button>
 *     <Button variant="primary">Confirm</Button>
 *   </ButtonGroup>
 *
 *   <ButtonGroup>
 *     <Button variant="tertiary">Skip</Button>
 *     <Button variant="secondary">Back</Button>
 *   </ButtonGroup>
 */
export function ButtonGroup({ className, children, ...props }: ButtonGroupProps) {
  const [first, second] = children;
  const ordered = rankOf(first) > rankOf(second) ? [second, first] : [first, second];
  return (
    <div role="group" className={cn("btn-group", className)} {...props}>
      {ordered}
    </div>
  );
}
