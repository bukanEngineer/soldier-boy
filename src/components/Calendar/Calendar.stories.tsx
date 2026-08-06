import React, { useState } from "react";
import { Calendar } from "./Calendar";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: { layout: "padded" },
  argTypes: {
    mode: { control: "select", options: ["single", "range"] },
    numberOfMonths: { control: { type: "number", min: 1, max: 3 } },
    onSelect: { action: "onSelect" },
  },
  args: {
    mode: "single",
    numberOfMonths: 1,
  },
};
export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date>(new Date());
    return <Calendar value={value} onSelect={(d) => setValue(d as Date)} />;
  },
};

export const NoSelection: Story = {
  render: () => <Calendar />,
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined });
    return (
      <Calendar
        mode="range"
        numberOfMonths={2}
        value={range}
        onSelect={(v) => setRange(v as { from?: Date; to?: Date })}
      />
    );
  },
};
