import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputCurrency } from "./InputCurrency";
import { AssetMark } from "../AssetMark/AssetMark";
import { Field } from "../Field/Field";
import { Tooltip } from "../Tooltip/Tooltip";
import { IconButton } from "../IconButton/IconButton";

const assetOptions = [
  { value: "eth", symbol: "Eth", logo: <AssetMark asset="ETH" size={24} /> },
  { value: "usdc", symbol: "USDC", logo: <AssetMark asset="USDC" size={24} /> },
  { value: "usdt", symbol: "USDT", logo: <AssetMark asset="USDT" size={24} /> },
];

const stablecoinCashOptions = [
  { value: "xsgd", symbol: "XSGD", logo: <AssetMark asset="XSGD" size={24} />, group: "stablecoin" },
  { value: "xusd", symbol: "XUSD", logo: <AssetMark asset="XUSD" size={24} />, group: "stablecoin" },
  { value: "usdc", symbol: "USDC", logo: <AssetMark asset="USDC" size={24} />, group: "stablecoin" },
  { value: "usdt", symbol: "USDT", logo: <AssetMark asset="USDT" size={24} />, group: "stablecoin" },
  { value: "sgd", symbol: "SGD", logo: <AssetMark asset="SGD" size={24} />, group: "cash" },
  { value: "usd", symbol: "USD", logo: <AssetMark asset="USD" size={24} />, group: "cash" },
];

function Example(
  props: React.ComponentProps<typeof InputCurrency> & {
    label?: string;
    labelHint?: string;
    helper?: string;
    error?: string;
  },
) {
  const { label, labelHint, helper, error, ...controlProps } = props;
  return (
    <Field.Root invalid={!!error}>
      {label && (
        <div className="field__label-row">
          <Field.Label>{label}</Field.Label>
          {labelHint && (
            <Tooltip.Root>
              <Tooltip.Trigger
                render={<IconButton icon="info" variant="tertiary" size="sm" label="More information" />}
              />
              <Tooltip.Popup side="top">{labelHint}</Tooltip.Popup>
            </Tooltip.Root>
          )}
        </div>
      )}
      <InputCurrency {...controlProps} />
      {helper && !error && <Field.Description>{helper}</Field.Description>}
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

const meta: Meta<typeof Example> = {
  title: "Components/InputCurrency",
  component: Example,
  args: { disabled: false, placeholder: "0.00" },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: "text" },
    labelHint: { control: "text" },
    helper: { control: "text" },
    error: { control: "text" },
    position: { control: "select", options: ["prefix", "suffix"] },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    onChange: { action: "onChange" },
  },
};
export default meta;

type Story = StoryObj<typeof Example>;

export const Suffix: Story = {
  args: {
    position: "suffix",
    placeholder: "0.00",
    defaultValue: "0.11",
    linkButton: { label: "Max", onClick: () => {} },
    asset: { defaultValue: "eth", options: assetOptions },
  },
};

export const Prefix: Story = {
  args: {
    label: "Label",
    position: "prefix",
    placeholder: "0.00",
    defaultValue: "0.11",
    asset: { defaultValue: "eth", options: assetOptions },
  },
};

export const GroupedByCategory: Story = {
  args: {
    label: "Amount",
    position: "suffix",
    placeholder: "0.00",
    defaultValue: "0.11",
    linkButton: { label: "Max", onClick: () => {} },
    asset: { defaultValue: "xsgd", options: stablecoinCashOptions },
  },
};

export const WithHelper: Story = {
  args: {
    label: "Amount",
    position: "suffix",
    placeholder: "0.00",
    helper: "Available balance: 1,300 ETH",
    linkButton: { label: "Max", onClick: () => {} },
    asset: { defaultValue: "eth", options: assetOptions },
  },
};

export const WithLabelHint: Story = {
  args: {
    label: "Amount",
    labelHint: "Enter the amount you want to transfer.",
    position: "suffix",
    defaultValue: "0.11",
    asset: { defaultValue: "eth", options: assetOptions },
  },
};

export const ErrorState: Story = {
  args: {
    label: "Amount",
    position: "suffix",
    defaultValue: "0.11",
    error: "Amount exceeds available balance.",
    asset: { defaultValue: "eth", options: assetOptions },
  },
};

export const Disabled: Story = {
  args: {
    label: "Amount",
    position: "suffix",
    defaultValue: "0.11",
    disabled: true,
    asset: { defaultValue: "eth", options: assetOptions },
  },
};
