import React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { withClass } from "../../lib/cn";
import "./Checkbox.css";

export type CheckboxRootProps = BaseCheckbox.Root.Props;
export type CheckboxIndicatorProps = BaseCheckbox.Indicator.Props;
export type CheckboxGroupProps = React.ComponentProps<typeof BaseCheckboxGroup>;

function CheckboxRoot({ className, ...props }: CheckboxRootProps) {
  return <BaseCheckbox.Root className={withClass("checkbox", className)} {...props} />;
}

function CheckboxIndicator({ className, children, ...props }: CheckboxIndicatorProps) {
  return (
    <BaseCheckbox.Indicator className={withClass("checkbox__indicator", className)} {...props}>
      {children ?? (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 8.5 L6.5 12 L13 4.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </BaseCheckbox.Indicator>
  );
}

function CheckboxGroup({ className, ...props }: CheckboxGroupProps) {
  return <BaseCheckboxGroup className={withClass("checkbox-group", className)} {...props} />;
}

/**
 * Checkbox on Base UI. Compose with a label; use `onCheckedChange` and
 * `indeterminate` for mixed state.
 *
 *   <label className="control">
 *     <Checkbox.Root checked={on} onCheckedChange={setOn}>
 *       <Checkbox.Indicator />
 *     </Checkbox.Root>
 *     <span className="control__label">Accept terms</span>
 *   </label>
 */
export const Checkbox = {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
  Group: CheckboxGroup,
};
