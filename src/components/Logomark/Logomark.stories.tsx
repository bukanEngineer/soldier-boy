import React from "react";
import { Logomark } from "./Logomark";

export default {
  title: "Atoms/Logomark",
  component: Logomark,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "range", min: 16, max: 240, step: 4 } },
    fill: { control: { type: "color" } },
  },
};

export const Default = { args: { size: 96, fill: "#00D37E" } };
export const OnDarkSurface = {
  args: { size: 96, fill: "#00D37E" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "#002B2A",
          padding: 48,
          borderRadius: 12,
          display: "inline-block",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
export const Monochrome = { args: { size: 96, fill: "#002B2A" } };

export const White = {
  args: { size: 96, tone: "white" },
  decorators: [
    (Story) => (
      <div style={{ background: "#002B2A", padding: 48, borderRadius: 12, display: "inline-block" }}>
        <Story />
      </div>
    ),
  ],
};

export const FullColourVsWhite = {
  parameters: { layout: "padded" },
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 48,
        alignItems: "center",
        background: "#002B2A",
        padding: 48,
        borderRadius: 12,
      }}
    >
      <Logomark size={96} />
      <Logomark size={96} tone="white" />
    </div>
  ),
};
