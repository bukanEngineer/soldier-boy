import React from "react";
import {
  BottomSheetSelect,
  type BottomSheetSelectItem,
  type BottomSheetSelectProps,
} from "../BottomSheet/BottomSheetSelect";

export type NetworkOption = BottomSheetSelectItem;

export type BottomSheetNetworkProps = Omit<BottomSheetSelectProps<NetworkOption>, "items" | "title"> & {
  /** Sheet heading */
  title?: React.ReactNode;
  /** Networks to choose from */
  networks: NetworkOption[];
};

/** Bottom sheet with a single-select network list. */
export function BottomSheetNetwork({ title = "Select Network", networks, ...props }: BottomSheetNetworkProps) {
  return <BottomSheetSelect title={title} items={networks} {...props} />;
}
