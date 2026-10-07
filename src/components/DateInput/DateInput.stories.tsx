import React, { useState } from "react";
import { DateInput } from "./DateInput";
import { Field } from "../Field/Field";
import type { Meta, StoryObj } from "@storybook/react-vite";

function Example(
  props: React.ComponentProps<typeof DateInput> & {
    label?: string;
    helper?: string;
    error?: string;
  },
) {
  const { label, helper, error, ...controlProps } = props;
  return (
    <Field.Root invalid={!!error}>
      {label && <Field.Label>{label}</Field.Label>}
      <DateInput {...controlProps} />
      {helper && !error && <Field.Description>{helper}</Field.Description>}
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

const meta: Meta<typeof Example> = {
  title: "Components/Date Input",
  component: Example,
  args: { range: false, disabled: false, label: "Date of birth" },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: "text" },
    helper: { control: "text" },
    error: { control: "text" },
    size: { control: "select", options: ["large", "small"] },
    range: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    onChange: { action: "onChange" },
  },
};
export default meta;

type Story = StoryObj<typeof Example>;

export const Default: Story = { args: { label: "Date of birth" } };
export const WithValue: Story = { args: { label: "Date of birth", defaultValue: "1990-04-15" } };
export const WithHelper: Story = {
  args: { label: "Date of birth", helper: "We use this to verify your identity." },
};
export const Error: Story = { args: { label: "Date of birth", error: "Must be 18 or older." } };
export const Disabled: Story = {
  args: { label: "Date of birth", defaultValue: "1990-04-15", disabled: true },
};
export const Small: Story = {
  args: { label: "Date of birth", size: "small", defaultValue: "1990-04-15" },
};
export const Range: Story = {
  render: () => {
    const [range, setRange] = useState({ start: "2026-01-01", end: "2026-03-31" });
    return (
      <Field.Root>
        <Field.Label>Statement period</Field.Label>
        <DateInput
          range
          startValue={range.start}
          endValue={range.end}
          onRangeChange={setRange}
        />
        <Field.Description>Pick a start and end date.</Field.Description>
      </Field.Root>
    );
  },
};
