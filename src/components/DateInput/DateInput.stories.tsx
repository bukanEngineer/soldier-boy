import React, { useState } from "react";
import { DateInput } from "./DateInput";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof DateInput> = {
  title: "Components/Date Input",
  component: DateInput,
  args: { range: false, disabled: false, label: "Date of birth" },
  parameters: { layout: "padded" },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
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

type Story = StoryObj<typeof DateInput>;

export const Default: Story = { args: { label: "Date of birth" } };
export const WithValue: Story = { args: { label: "Date of birth", defaultValue: "1990-04-15" } };
export const WithHelper: Story = { args: { label: "Date of birth", helper: "We use this to verify your identity." } };
export const Error: Story = { args: { label: "Date of birth", error: "Must be 18 or older." } };
export const Disabled: Story = { args: { label: "Date of birth", defaultValue: "1990-04-15", disabled: true } };
export const Small: Story = { args: { label: "Date of birth", size: "small", defaultValue: "1990-04-15" } };
export const Range: Story = {
  render: () => {
    const [range, setRange] = useState({ start: "2026-01-01", end: "2026-03-31" });
    return (
      <DateInput
        label="Statement period"
        range
        startValue={range.start}
        endValue={range.end}
        onRangeChange={setRange}
        helper="Pick a start and end date."
      />
    );
  },
};
