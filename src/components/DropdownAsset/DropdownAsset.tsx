import React from "react";
import { cn } from "../../lib/cn";
import {
  OptionList,
  type OptionListItem,
  type OptionListProps,
} from "../OptionList/OptionList";

export type DropdownAssetOption = OptionListItem & {
  /** Balance shown as trailing mono text */
  balance?: React.ReactNode;
};

export type DropdownAssetProps = Omit<OptionListProps, "options"> & {
  options?: DropdownAssetOption[];
};

/** Asset option list with optional trailing balance. Thin recipe over `OptionList`. */
export function DropdownAsset({ options = [], className, ...props }: DropdownAssetProps) {
  const mapped: OptionListItem[] = options.map(({ balance, trailing, ...rest }) => ({
    ...rest,
    trailing: trailing ?? balance,
  }));
  return (
    <OptionList
      options={mapped}
      className={cn("option-list--elevated", className)}
      {...props}
    />
  );
}
