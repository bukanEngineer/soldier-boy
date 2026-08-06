import React from "react";
import { MultiSelect } from "./MultiSelect";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof MultiSelect> = {
  title: "Components/Multi Select",
  component: MultiSelect,
  args: { disabled: false },
  argTypes: {
    disabled: { control: "boolean" },
  },
  parameters: { layout: "padded" },
  decorators: [(Story) => <div style={{ maxWidth: 360, minHeight: 360 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof MultiSelect>;

const networks = [
  { value: "eth", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "base", label: "Base" },
  { value: "solana", label: "Solana", disabled: true },
];

export const Default: Story = { args: { label: "Supported networks", options: networks, placeholder: "Select networks" } };
export const WithValue: Story = { args: { label: "Supported networks", options: networks, defaultValue: ["eth", "base"] } };
export const WithHelper: Story = { args: { label: "Supported networks", options: networks, helper: "Choose one or more networks for this asset." } };
export const Error: Story = { args: { label: "Supported networks", options: networks, error: "Select at least one network." } };
export const Disabled: Story = { args: { label: "Supported networks", options: networks, defaultValue: ["eth"], disabled: true } };
