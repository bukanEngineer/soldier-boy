import React from "react";
import {
  FieldOptionSelect,
  type FieldOption,
  type FieldOptionSelectProps,
  type FieldOptionStatus,
} from "../FieldOptionSelect/FieldOptionSelect";

export type FieldNetworkOption = {
  value: string;
  name?: string;
  logo?: React.ReactNode;
  secondary?: React.ReactNode;
  status?: FieldOptionStatus;
  disabled?: boolean;
};

export type FieldNetworkProps = Omit<FieldOptionSelectProps, "options" | "placeholder"> & {
  options?: FieldNetworkOption[];
  placeholder?: string;
};

function toFieldOption(o: FieldNetworkOption): FieldOption {
  return {
    value: o.value,
    name: o.name,
    logo: o.logo,
    lines: o.secondary != null && o.secondary !== "" ? [o.secondary] : [],
    status: o.status,
    disabled: o.disabled,
  };
}

/** Network Select. Thin recipe over `FieldOptionSelect`. Use inside `Field`. */
export function FieldNetwork({
  options = [],
  placeholder = "Select Network",
  ...props
}: FieldNetworkProps) {
  return (
    <FieldOptionSelect
      options={options.map(toFieldOption)}
      placeholder={placeholder}
      {...props}
    />
  );
}
