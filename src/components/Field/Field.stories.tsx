import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";

const meta: Meta<typeof Field.Root> = {
  title: "Components/Field",
  component: Field.Root,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Field.Root>;

const control: React.CSSProperties = {
  height: 40,
  padding: "0 12px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  font: "var(--body-medium)",
};

export const Default: Story = {
  render: (args) => (
    <Field.Root {...args} style={{ maxWidth: 320 }}>
      <Field.Label>Email</Field.Label>
      <Field.Control type="email" required placeholder="name@company.com" style={control} />
      <Field.Description>Used for transaction receipts.</Field.Description>
      <Field.Error match="valueMissing">Please enter your email.</Field.Error>
      <Field.Error match="typeMismatch">Enter a valid email address.</Field.Error>
    </Field.Root>
  ),
};

export const ServerError: Story = {
  render: () => (
    <Field.Root invalid style={{ maxWidth: 320 }}>
      <Field.Label>Email</Field.Label>
      <Field.Control defaultValue="taken@company.com" style={control} />
      <Field.Error match>This email is already registered.</Field.Error>
    </Field.Root>
  ),
};
