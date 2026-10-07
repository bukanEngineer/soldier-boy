import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copybox } from "./Copybox";
import { Field } from "../Field/Field";
import { ToastProvider } from "../Toast/Toast";

const meta: Meta<typeof Copybox> = {
  title: "P1 Components/Copybox",
  component: Copybox,
  parameters: { layout: "padded" },
  decorators: [(Story) => <ToastProvider><div style={{ maxWidth: 400 }}><Story /></div></ToastProvider>],
  argTypes: {
    size: { control: "inline-radio", options: ["large", "sm"] },
    buttonVariant: { control: "inline-radio", options: ["text", "icon"] },
  },
  args: { value: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", size: "large", buttonVariant: "text" },
};
export default meta;

type Story = StoryObj<typeof Copybox>;

export const Default: Story = {};
export const IconButton: Story = { args: { buttonVariant: "icon" } };
export const Small: Story = { args: { size: "sm" } };
export const Truncated: Story = { args: { truncate: true } };
export const NoAction: Story = { args: { action: false } };
export const Multiline: Story = {
  args: { multiline: true, value: "Bank: DBS Bank Ltd\nAccount: 123-456789-0\nReference: STX-8842" },
};
export const WithLeading: Story = {
  args: { leading: <span className="material-symbols-rounded">account_balance</span> },
};

/* Label, helper and error come from Field. Copybox is not a form control, so
 * the label renders as a <div>. */
export const InField: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Field.Root>
        <Field.Label nativeLabel={false} render={<div />}>Wallet address</Field.Label>
        <Copybox {...args} />
        <Field.Description>Only send USDC on Ethereum to this address.</Field.Description>
      </Field.Root>
      <Field.Root invalid>
        <Field.Label nativeLabel={false} render={<div />}>Wallet address</Field.Label>
        <Copybox {...args} />
        <Field.Error match>This address is no longer active.</Field.Error>
      </Field.Root>
    </div>
  ),
};
