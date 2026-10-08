import React from "react";
import { Logo } from "./Logo";

export default {
  title: "Foundations/StraitsX Logo",
  component: Logo,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "range", min: 80, max: 480, step: 8 } },
    tone: { control: { type: "select" }, options: ["default", "white"] },
  },
};

export const Default = { args: { size: 200, tone: "default" } };

export const White = {
  args: { size: 200, tone: "white" },
  decorators: [
    (Story) => (
      <div style={{ background: "#002B2A", padding: 48, borderRadius: 12, display: "inline-block" }}>
        <Story />
      </div>
    ),
  ],
};
