import React from "react";
import {
  BottomSheetSelect,
  type BottomSheetSelectItem,
  type BottomSheetSelectProps,
} from "../BottomSheet/BottomSheetSelect";
import { cn } from "../../lib/cn";
import "./BottomSheetBlockchain.css";

export type BlockchainOption = BottomSheetSelectItem;

export type BottomSheetBlockchainProps = Omit<BottomSheetSelectProps<BlockchainOption>, "items" | "title"> & {
  /** Sheet heading */
  title?: React.ReactNode;
  /** Chains or wallets to choose from */
  chains: BlockchainOption[];
};

/** Bottom sheet with a single-select chain / wallet list. Descriptions (addresses) render in mono. */
export function BottomSheetBlockchain({ title = "Select Blockchain", chains, className, ...props }: BottomSheetBlockchainProps) {
  return <BottomSheetSelect title={title} items={chains} className={cn("bsc", className)} {...props} />;
}
