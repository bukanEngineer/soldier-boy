import React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { withClass } from "../../lib/cn";
import "../Checkbox/Checkbox.css";
import "./Switch.css";

export type SwitchRootProps = BaseSwitch.Root.Props;
export type SwitchThumbProps = BaseSwitch.Thumb.Props;

function SwitchRoot({ className, ...props }: SwitchRootProps) {
  return <BaseSwitch.Root className={withClass("switch", className)} {...props} />;
}

function SwitchThumb({ className, ...props }: SwitchThumbProps) {
  return <BaseSwitch.Thumb className={withClass("switch__thumb", className)} {...props} />;
}

/**
 * Switch on Base UI.
 *
 *   <label className="control">
 *     <Switch.Root checked={on} onCheckedChange={setOn}>
 *       <Switch.Thumb />
 *     </Switch.Root>
 *     <span className="control__label">Sandbox mode</span>
 *   </label>
 */
export const Switch = {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
};
