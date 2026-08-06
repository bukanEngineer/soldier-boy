import React from "react";
import { Select } from "./Select";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  args: { disabled: false },
  argTypes: {
    disabled: { control: "boolean" },
    size: { control: "inline-radio", options: ["large", "small"] },
  },
  parameters: { layout: "padded" },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Select>;

const currencies = [
  { value: "xsgd", label: "XSGD — Singapore Dollar" },
  { value: "xidr", label: "XIDR — Indonesian Rupiah" },
  { value: "xusd", label: "XUSD — US Dollar" },
];

export const Default: Story = { args: { label: "Currency", options: currencies } };
export const Small: Story = { args: { label: "Currency", size: "small", options: currencies, defaultValue: "xsgd" } };
export const WithValue: Story = { args: { label: "Currency", options: currencies, defaultValue: "xsgd" } };
export const WithHelper: Story = { args: { label: "Currency", helper: "Pick the stablecoin you want to mint.", options: currencies } };
export const Error: Story = { args: { label: "Currency", error: "Please select a currency.", options: currencies } };
export const Disabled: Story = { args: { label: "Currency", disabled: true, options: currencies, defaultValue: "xsgd" } };
