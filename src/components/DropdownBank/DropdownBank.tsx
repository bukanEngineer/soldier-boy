import React from "react";
import {
  OptionList,
  type OptionListItem,
  type OptionListProps,
  type OptionListTag,
} from "../OptionList/OptionList";

export type DropdownBankOption = Omit<OptionListItem, "secondary"> & {
  /** Account number / mask shown as secondary text */
  account?: React.ReactNode;
  secondary?: React.ReactNode;
};

export type DropdownBankProps = Omit<OptionListProps, "options"> & {
  options?: DropdownBankOption[];
};

/** Bank account option list. Thin recipe over `OptionList`. */
export function DropdownBank({ options = [], ...props }: DropdownBankProps) {
  const mapped: OptionListItem[] = options.map(({ account, secondary, ...rest }) => ({
    ...rest,
    secondary: secondary ?? account,
  }));
  return <OptionList options={mapped} {...props} />;
}

export type { OptionListTag };
