import React from "react";
import {
  OptionList,
  type OptionListItem,
  type OptionListProps,
} from "../OptionList/OptionList";

export type DropdownBlockchainOption = Omit<OptionListItem, "secondary"> & {
  /** Wallet address shown as secondary text */
  address?: React.ReactNode;
  secondary?: React.ReactNode;
};

export type DropdownBlockchainProps = Omit<OptionListProps, "options"> & {
  options?: DropdownBlockchainOption[];
};

/** Blockchain wallet option list. Thin recipe over `OptionList`. */
export function DropdownBlockchain({ options = [], ...props }: DropdownBlockchainProps) {
  const mapped: OptionListItem[] = options.map(({ address, secondary, ...rest }) => ({
    ...rest,
    secondary: secondary ?? address,
  }));
  return <OptionList options={mapped} {...props} />;
}
