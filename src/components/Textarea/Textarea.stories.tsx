import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";
import { Field } from "../Field/Field";

function Example(props: React.ComponentProps<typeof Textarea> & {
  label?: string;
  helper?: string;
  error?: string;
}) {
  const { label, helper, error, ...textareaProps } = props;
  return (
    <Field.Root invalid={!!error}>
      {label && <Field.Label>{label}</Field.Label>}
      <Textarea {...textareaProps} />
      {helper && !error && <Field.Description>{helper}</Field.Description>}
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

const meta: Meta<typeof Example> = {
  title: "Components/Textarea",
  component: Example,
  parameters: { layout: "padded" },
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
    label: "Notes",
    helper: "Visible on the transfer receipt.",
    placeholder: "Optional message",
    showCount: true,
    maxLength: 200,
  },
};

export const ErrorState: Story = {
  args: {
    label: "Notes",
    defaultValue: "too short",
    error: "Please add more detail.",
  },
};

export const Disabled: Story = {
  args: { label: "Notes", defaultValue: "Locked", disabled: true },
};
