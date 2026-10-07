import React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { withClass } from "../../lib/cn";
import "../Checkbox/Checkbox.css";
import "./Radio.css";

export type RadioGroupProps = React.ComponentProps<typeof BaseRadioGroup>;
export type RadioRootProps = BaseRadio.Root.Props;
export type RadioIndicatorProps = BaseRadio.Indicator.Props;

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <BaseRadioGroup className={withClass("radio-group", className)} {...props} />;
}

function RadioRoot({ className, ...props }: RadioRootProps) {
  return <BaseRadio.Root className={withClass("radio", className)} {...props} />;
}

function RadioIndicator({ className, ...props }: RadioIndicatorProps) {
  return <BaseRadio.Indicator className={withClass("radio__indicator", className)} {...props} />;
}

/**
 * Radio on Base UI. Wrap items in `Radio.Group` for arrow-key navigation.
 *
 *   <Radio.Group value={v} onValueChange={setV}>
 *     <label className="control">
 *       <Radio.Root value="a"><Radio.Indicator /></Radio.Root>
 *       <span className="control__label">Option A</span>
 *     </label>
 *   </Radio.Group>
 */
export const Radio = {
  Group: RadioGroup,
  Root: RadioRoot,
  Indicator: RadioIndicator,
};
