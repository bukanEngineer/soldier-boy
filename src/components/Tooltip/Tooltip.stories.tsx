import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";
import { IconButton } from "../IconButton/IconButton";
import { Button } from "../Button/Button";

const meta: Meta<typeof Tooltip.Popup> = {
  title: "Components/Tooltip",
  component: Tooltip.Popup,
  parameters: { layout: "centered" },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
  args: { side: "top" },
};
export default meta;

type Story = StoryObj<typeof Tooltip.Popup>;

export const Default: Story = {
  render: (args) => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger render={<IconButton icon="info" variant="secondary" label="Info" />} />
        <Tooltip.Popup {...args}>
          Maximum transfer amount is S$10,000/day until full verification.
        </Tooltip.Popup>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const AllSides: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <Tooltip.Provider>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 32,
          padding: 40,
          placeItems: "center",
        }}
      >
        {(["top", "bottom", "left", "right"] as const).map((side) => (
          <Tooltip.Root key={side}>
            <Tooltip.Trigger render={<Button />}>{side}</Tooltip.Trigger>
            <Tooltip.Popup side={side}>{side} tooltip</Tooltip.Popup>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  ),
};

export const AlwaysOpen: Story = {
  render: (args) => (
    <Tooltip.Provider>
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger render={<IconButton icon="help" variant="secondary" label="Help" />} />
        <Tooltip.Popup {...args}>This is always shown</Tooltip.Popup>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};
