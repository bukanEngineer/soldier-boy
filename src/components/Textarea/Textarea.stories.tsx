import React from "react";
import { Textarea } from "./Textarea";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  args: { showCount: false, disabled: false },
  argTypes: {
    label: { control: "text" },
    helper: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
    showCount: { control: "boolean" },
    maxLength: { control: { type: "number", min: 0 } },
    onChange: { action: "onChange" },
  },
  parameters: { layout: "padded" },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { label: "Reason for transfer", placeholder: "Type a note for your records…" } };
export const WithCounter: Story = { args: { label: "Reason for transfer", maxLength: 280, showCount: true, defaultValue: "Monthly rent." } };
export const Error: Story = { args: { label: "Reason for transfer", error: "This field is required." } };
export const Disabled: Story = { args: { label: "Reason for transfer", disabled: true, defaultValue: "Monthly rent." } };

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <Textarea label="Enabled" placeholder="Type a note…" />
      <Textarea label="Hovered" state="hovered" placeholder="Type a note…" />
      <Textarea label="Focused" state="focused" placeholder="Type a note…" />
      <Textarea label="Error" error="This field is required." />
      <Textarea label="Disabled" disabled defaultValue="Monthly rent." />
    </div>
  ),
};
