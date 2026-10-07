import React, { useState } from "react";
import { Icon } from "../Icon/Icon";
import { Menu } from "../Menu/Menu";
import { Field } from "../Field/Field";
import { cn } from "../../lib/cn";
import "./InputCurrency.css";

const ASSET_GROUP_LABELS: Record<string, string> = { stablecoin: "Stablecoin", cash: "Cash" };
const ASSET_GROUP_ORDER = ["stablecoin", "cash"] as const;

export type InputCurrencyAssetOption = {
  value: string;
  symbol?: string;
  logo?: React.ReactNode;
  group?: string;
  disabled?: boolean;
};

export type InputCurrencyAsset = {
  value?: string;
  defaultValue?: string;
  symbol?: string;
  logo?: React.ReactNode;
  dropdown?: boolean;
  options?: InputCurrencyAssetOption[];
  onChange?: (value: string, option?: InputCurrencyAssetOption) => void;
  disabled?: boolean;
};

export type InputCurrencyLinkButton = {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
};

export type InputCurrencyProps = {
  /** Asset adornment on the start (`prefix`) or end (`suffix`) of the field */
  position?: "prefix" | "suffix";
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Leading icon inside the amount field */
  icon?: React.ReactNode;
  /** Trailing text action (e.g. Max) */
  linkButton?: InputCurrencyLinkButton;
  /** Asset symbol / logo / dropdown config */
  asset?: InputCurrencyAsset;
  /** Additional CSS class names on the chrome wrapper */
  className?: string;
} & Omit<
  React.ComponentProps<typeof Field.Control>,
  | "size"
  | "type"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onValueChange"
  | "className"
  | "placeholder"
  | "disabled"
>;

function renderAssetRadioItem(o: InputCurrencyAssetOption) {
  return (
    <Menu.RadioItem key={o.value} value={o.value} leading={o.logo} disabled={o.disabled}>
      {o.symbol ?? o.value}
    </Menu.RadioItem>
  );
}

function renderAssetOptions(options: InputCurrencyAssetOption[]) {
  const hasGroups = options.some((o) => o.group);
  if (!hasGroups) {
    return options.map((o) => renderAssetRadioItem(o));
  }
  const nodes: React.ReactNode[] = [];
  ASSET_GROUP_ORDER.forEach((group, i) => {
    const groupOptions = options.filter((o) => o.group === group);
    if (groupOptions.length === 0) return;
    if (i > 0 && nodes.length > 0) nodes.push(<Menu.Separator key={`${group}-divider`} />);
    nodes.push(
      <Menu.GroupLabel key={`${group}-label`}>{ASSET_GROUP_LABELS[group]}</Menu.GroupLabel>,
    );
    groupOptions.forEach((o) => nodes.push(renderAssetRadioItem(o)));
  });
  return nodes;
}

/**
 * Bare currency amount control for use inside `Field`. Label, helper and error
 * come from `Field`. Asset picker stays on the control via `asset`.
 *
 *   <Field.Root>
 *     <Field.Label>Amount</Field.Label>
 *     <InputCurrency
 *       defaultValue="0.11"
 *       asset={{ defaultValue: "eth", options }}
 *     />
 *     <Field.Description>Available: 1,300 ETH</Field.Description>
 *   </Field.Root>
 */
export function InputCurrency({
  position = "suffix",
  value,
  defaultValue,
  onChange,
  onValueChange,
  placeholder = "0.00",
  disabled = false,
  icon,
  linkButton,
  asset = {},
  className,
  ...inputProps
}: InputCurrencyProps) {
  const isPrefix = position === "prefix";

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(String(defaultValue ?? ""));
  const currentValue = isControlled ? String(value) : internal;

  const commit = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
    onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLInputElement>);
  };

  const {
    value: assetValue,
    defaultValue: assetDefaultValue,
    symbol: assetSymbol = "",
    logo: assetLogo,
    dropdown = true,
    options = [],
    onChange: onAssetChange,
    disabled: assetDisabled = false,
  } = asset;

  const hasOptions = options.length > 0;
  const assetIsControlled = assetValue !== undefined;
  const [internalAsset, setInternalAsset] = useState(assetDefaultValue ?? options[0]?.value);
  const selectedAssetValue = assetIsControlled ? assetValue : internalAsset;
  const selectedOption = options.find((o) => o.value === selectedAssetValue);

  const commitAsset = (val: string, opt?: InputCurrencyAssetOption) => {
    if (opt?.disabled) return;
    if (!assetIsControlled) setInternalAsset(val);
    onAssetChange?.(val, opt);
  };

  const displayLogo = selectedOption?.logo ?? assetLogo;
  const displaySymbol = selectedOption?.symbol ?? assetSymbol;
  const hasAdornment = hasOptions || !!displaySymbol || !!displayLogo;
  const adornmentDisabled = disabled || assetDisabled;

  const adornmentContent = (
    <>
      {displayLogo && (
        <span className="input-currency__mark" aria-hidden="true">
          {displayLogo}
        </span>
      )}
      {displaySymbol && <span className="input-currency__symbol">{displaySymbol}</span>}
      {dropdown && <Icon name="expand_more" size={24} className="input-currency__chevron" />}
    </>
  );

  const adornment = hasOptions ? (
    <Menu.Root>
      <Menu.Trigger
        disabled={adornmentDisabled}
        className="input-currency__adornment input-currency__menu-trigger"
      >
        {adornmentContent}
      </Menu.Trigger>
      <Menu.Popup align={isPrefix ? "start" : "end"}>
        <Menu.RadioGroup
          value={selectedAssetValue}
          onValueChange={(val) => {
            const opt = options.find((o) => o.value === val);
            commitAsset(String(val), opt);
          }}
        >
          {renderAssetOptions(options)}
        </Menu.RadioGroup>
      </Menu.Popup>
    </Menu.Root>
  ) : (
    <div
      className="input-currency__adornment input-currency__adornment--static"
      aria-hidden={!displaySymbol && !displayLogo}
    >
      {adornmentContent}
    </div>
  );

  return (
    <div
      className={cn("input-currency", `input-currency--${position}`, className)}
      data-disabled={disabled || undefined}
    >
      {hasAdornment && isPrefix && adornment}
      <div className="input-currency__field">
        {icon && (
          <span className="input-currency__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <Field.Control
          type="text"
          inputMode="decimal"
          className="input-currency__input"
          disabled={disabled}
          placeholder={placeholder}
          value={currentValue}
          onValueChange={commit}
          {...inputProps}
        />
        {linkButton && (
          <button
            type="button"
            className="input-currency__link"
            onClick={linkButton.onClick}
            disabled={disabled || linkButton.disabled}
          >
            {linkButton.label || "Max"}
          </button>
        )}
      </div>
      {hasAdornment && !isPrefix && adornment}
    </div>
  );
}
