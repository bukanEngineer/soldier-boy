import React from "react";
import { OptionList, type OptionListItem, type OptionListProps } from "../OptionList/OptionList";

export type DropdownNetworkOption = OptionListItem;

export type DropdownNetworkProps = Omit<OptionListProps, "options"> & {
  options?: DropdownNetworkOption[];
};

/** Network option list. Thin recipe over `OptionList`. */
export function DropdownNetwork(props: DropdownNetworkProps) {
  return <OptionList {...props} />;
}
