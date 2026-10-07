import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListSupportedNetwork } from "./ListSupportedNetwork";

const meta: Meta<typeof ListSupportedNetwork> = {
  title: "Patterns/List/Supported Network",
  component: ListSupportedNetwork,
  args: { isNew: false },
  parameters: { layout: "padded" },
  argTypes: {
    overflow: { control: "number" },
    isNew: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof ListSupportedNetwork>;

const dot = (c: string) => (
  <span
    style={{
      display: "block",
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: c,
      border: "1.5px solid var(--surface)",
    }}
  />
);
const marks = [dot("#627EEA"), dot("#8247E5"), dot("#2775CA"), dot("#26A17B")];

export const Default: Story = { args: { networks: marks.slice(0, 3) } };
export const WithOverflow: Story = { args: { networks: marks.slice(0, 3), overflow: 4 } };
export const New: Story = { args: { networks: marks.slice(0, 2), isNew: true } };
export const Single: Story = { args: { networks: marks.slice(0, 1) } };
