import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./Popover";
import { IconButton } from "../IconButton/IconButton";
import { Tag } from "../Tag/Tag";
import { AssetMark } from "../AssetMark/AssetMark";

const meta: Meta<typeof Popover.Popup> = {
  title: "Components/Popover",
  component: Popover.Popup,
  parameters: { layout: "centered" },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
  args: { side: "top" },
};
export default meta;

type Story = StoryObj<typeof Popover.Popup>;

export const WithTitle: Story = {
  render: (args) => (
    <Popover.Root defaultOpen>
      <Popover.Trigger render={<IconButton icon="info" variant="secondary" label="Info" />} />
      <Popover.Popup {...args}>
        <Popover.Header>
          <Popover.Title>Transfer limit</Popover.Title>
        </Popover.Header>
        <Popover.Description>
          Maximum transfer amount is S$10,000/day until full verification is complete.
        </Popover.Description>
      </Popover.Popup>
    </Popover.Root>
  ),
};

export const WithTag: Story = {
  render: (args) => (
    <Popover.Root defaultOpen>
      <Popover.Trigger render={<IconButton icon="info" variant="secondary" label="Info" />} />
      <Popover.Popup {...args}>
        <Popover.Header>
          <Popover.Title>Multi-chain support</Popover.Title>
          <Tag tone="info">Beta</Tag>
        </Popover.Header>
        <Popover.Description>This token is available across multiple networks.</Popover.Description>
      </Popover.Popup>
    </Popover.Root>
  ),
};

export const SupportedChain: Story = {
  render: (args) => (
    <Popover.Root defaultOpen>
      <Popover.Trigger render={<IconButton icon="info" variant="secondary" label="Info" />} />
      <Popover.Popup {...args}>
        <Popover.Header>
          <Popover.Title>Supported tokens</Popover.Title>
        </Popover.Header>
        <Popover.Description>
          <span style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["XSGD", "USDT", "USDC", "XUSD"].map((a) => (
              <span key={a} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AssetMark asset={a} size={20} />
                <span>{a}</span>
              </span>
            ))}
          </span>
        </Popover.Description>
      </Popover.Popup>
    </Popover.Root>
  ),
};

export const WithActions: Story = {
  args: { side: "bottom" },
  render: (args) => (
    <Popover.Root defaultOpen>
      <Popover.Trigger render={<IconButton icon="info" variant="secondary" label="Info" />} />
      <Popover.Popup {...args}>
        <Popover.Header>
          <Popover.Title>Verification required</Popover.Title>
        </Popover.Header>
        <Popover.Description>Verify your identity to raise your daily transfer limit.</Popover.Description>
        <Popover.Footer>
          <button type="button" className="popover__link">Verify now</button>
          <button type="button" className="popover__link">Learn more</button>
        </Popover.Footer>
      </Popover.Popup>
    </Popover.Root>
  ),
};
