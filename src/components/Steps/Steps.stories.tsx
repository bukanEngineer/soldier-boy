import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HorizontalSteps,
  VerticalSteps,
  VerticalStep,
  BadgeSteps,
} from "./Steps";

const meta = {
  title: "P1 Components/Steps",
  component: HorizontalSteps,
  parameters: { layout: "padded" },
  argTypes: {
    total: { control: { type: "number", min: 2, max: 7 } },
    current: { control: { type: "number", min: 1 } },
    showCount: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    total: 3,
    current: 1,
    showCount: true,
    label: "Steps",
  },
} satisfies Meta<typeof HorizontalSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: { total: 7, current: 4, label: "Questions" },
};

export const HorizontalStepCounts: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {[2, 3, 4, 5, 6, 7].map((n) => (
        <HorizontalSteps key={n} total={n} current={Math.ceil(n / 2)} label="Text" />
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <VerticalSteps>
      <VerticalStep status="completed" timestamp="19 Feb 2025 | 03:46">
        Request Resolved
      </VerticalStep>
      <VerticalStep status="completed" timestamp="19 Feb 2025 | 03:46">
        Under Review by StraitsX
      </VerticalStep>
      <VerticalStep status="completed" timestamp="19 Feb 2025 | 03:46">
        Information submitted by “agent name/email”
      </VerticalStep>
      <VerticalStep status="active" timestamp="19 Feb 2025 | 03:46">
        Awaiting Response
      </VerticalStep>
      <VerticalStep status="inactive" timestamp="19 Feb 2025 | 03:46">
        Request Created
      </VerticalStep>
    </VerticalSteps>
  ),
};

export const VerticalFailed: Story = {
  render: () => (
    <VerticalSteps>
      <VerticalStep status="completed" timestamp="19 Feb 2025 | 03:46">
        Request Resolved
      </VerticalStep>
      <VerticalStep
        status="failed"
        timestamp="19 Feb 2025 | 03:46"
        note="Document image was unreadable"
      >
        Verification Failed
      </VerticalStep>
      <VerticalStep status="inactive" timestamp="19 Feb 2025 | 03:46">
        Request Created
      </VerticalStep>
    </VerticalSteps>
  ),
};

export const Badge: Story = {
  render: () => (
    <BadgeSteps
      step={1}
      title="Select Transfer Method"
      description="Select Transfer Method"
    />
  ),
};
