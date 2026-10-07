import React from "react";
import {
  BottomSheetSelect,
  type BottomSheetSelectItem,
  type BottomSheetSelectProps,
} from "../BottomSheet/BottomSheetSelect";

export type BankOption = BottomSheetSelectItem;

export type BottomSheetBankProps = Omit<BottomSheetSelectProps<BankOption>, "items" | "title"> & {
  /** Sheet heading */
  title?: React.ReactNode;
  /** Banks to choose from */
  banks: BankOption[];
};

/** Bottom sheet with a single-select bank list. */
export function BottomSheetBank({ title = "Select Bank", banks, ...props }: BottomSheetBankProps) {
  return <BottomSheetSelect title={title} items={banks} {...props} />;
}
