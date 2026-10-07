import React from "react";
import {
  FieldOptionSelect,
  type FieldOption,
  type FieldOptionSelectProps,
  type FieldOptionAction,
  type FieldOptionStatus,
} from "../FieldOptionSelect/FieldOptionSelect";

export type FieldBlockchainOption = {
  value: string;
  name?: string;
  logo?: React.ReactNode;
  address?: React.ReactNode;
  secondary?: React.ReactNode;
  status?: FieldOptionStatus;
  action?: FieldOptionAction;
  disabled?: boolean;
};

export type FieldBlockchainProps = Omit<FieldOptionSelectProps, "options" | "placeholder"> & {
  options?: FieldBlockchainOption[];
  placeholder?: string;
};

function toFieldOption(o: FieldBlockchainOption): FieldOption {
  return {
    value: o.value,
    name: o.name,
    logo: o.logo,
    lines: [o.address, o.secondary].filter((line) => line != null && line !== ""),
    status: o.status,
    action: o.action,
    disabled: o.disabled,
  };
}

/** Blockchain wallet Select. Thin recipe over `FieldOptionSelect`. Use inside `Field`. */
export function FieldBlockchain({
  options = [],
  placeholder = "Select Wallet",
  ...props
}: FieldBlockchainProps) {
  return (
    <FieldOptionSelect
      options={options.map(toFieldOption)}
      placeholder={placeholder}
      {...props}
    />
  );
}
