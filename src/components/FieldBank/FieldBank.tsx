import React from "react";
import {
  FieldOptionSelect,
  type FieldOption,
  type FieldOptionSelectProps,
  type FieldOptionAction,
  type FieldOptionStatus,
} from "../FieldOptionSelect/FieldOptionSelect";

export type FieldBankOption = {
  value: string;
  name?: string;
  logo?: React.ReactNode;
  account?: React.ReactNode;
  swift?: React.ReactNode;
  status?: FieldOptionStatus;
  action?: FieldOptionAction;
  disabled?: boolean;
};

export type FieldBankProps = Omit<FieldOptionSelectProps, "options" | "placeholder"> & {
  options?: FieldBankOption[];
  placeholder?: string;
};

function toFieldOption(o: FieldBankOption): FieldOption {
  return {
    value: o.value,
    name: o.name,
    logo: o.logo,
    lines: [o.account, o.swift].filter((line) => line != null && line !== ""),
    status: o.status,
    action: o.action,
    disabled: o.disabled,
  };
}

/** Bank account Select. Thin recipe over `FieldOptionSelect`. Use inside `Field`. */
export function FieldBank({
  options = [],
  placeholder = "Select Account",
  ...props
}: FieldBankProps) {
  return (
    <FieldOptionSelect
      options={options.map(toFieldOption)}
      placeholder={placeholder}
      {...props}
    />
  );
}
