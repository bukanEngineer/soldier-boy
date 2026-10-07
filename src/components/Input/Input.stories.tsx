import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";
import { Field } from "../Field/Field";

function Example(props: React.ComponentProps<typeof Input> & {
  label?: string;
  helper?: string;
  error?: string;
}) {
  const { label, helper, error, ...inputProps } = props;
  return (
    <Field.Root invalid={!!error}>
      {label && <Field.Label>{label}</Field.Label>}
      <Input {...inputProps} />
      {helper && !error && <Field.Description>{helper}</Field.Description>}
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

const meta: Meta<typeof Example> = {
  title: "Components/Input",
  component: Example,
  parameters: { layout: "padded" },
  args: { disabled: false },
  argTypes: {
    label: { control: "text" },
    helper: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    size: { control: "inline-radio", options: ["large", "small"] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Example>;

export const Default: Story = {
  args: {
    label: "Email",
    helper: "We'll send your verification code here.",
    placeholder: "hello@straitsx.com",
  },
};

export const Password: Story = {
  args: { label: "Password", type: "password", defaultValue: "ferret-cobalt-mountain" },
};

export const Search: Story = {
  args: { type: "search", placeholder: "Search transactions" },
};

export const WithTrailingButton: Story = {
  args: {
    label: "Promo code",
    placeholder: "Enter code",
    trailingButton: { label: "Apply", onClick: () => {} },
  },
};

export const ErrorState: Story = {
  args: {
    label: "Wallet address",
    defaultValue: "0xa1B…f2",
    error: "Address checksum doesn't match.",
  },
};

export const Disabled: Story = {
  args: { label: "Account number", defaultValue: "0123 4567 8901", disabled: true },
};

export const Small: Story = {
  args: {
    label: "Email",
    size: "small",
    placeholder: "hello@straitsx.com",
    helper: "Compact 36px field.",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 360 }}>
      <Example size="large" label="Large (48px)" placeholder="hello@straitsx.com" />
      <Example size="small" label="Small (36px)" placeholder="hello@straitsx.com" />
    </div>
  ),
};
