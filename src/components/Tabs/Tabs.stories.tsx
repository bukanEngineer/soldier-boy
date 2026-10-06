import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";
import { Badge } from "../Badge";

const meta: Meta<typeof Tabs.List> = {
  title: "Components/Tabs",
  component: Tabs.List,
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "secondary"] },
    fill: { control: "boolean" },
  },
  args: { variant: "default", fill: false },
};
export default meta;

type Story = StoryObj<typeof Tabs.List>;

const body = { font: "var(--body-medium)" };

export const Default: Story = {
  render: (args) => (
    <Tabs.Root defaultValue="in">
      <Tabs.List {...args}>
        <Tabs.Tab value="in">Transfer In</Tabs.Tab>
        <Tabs.Tab value="out">Transfer Out</Tabs.Tab>
        <Tabs.Tab value="swap">Swap</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="in"><p style={body}>Funds arriving from your bank.</p></Tabs.Panel>
      <Tabs.Panel value="out"><p style={body}>Send funds out.</p></Tabs.Panel>
      <Tabs.Panel value="swap"><p style={body}>Swap between stablecoins.</p></Tabs.Panel>
    </Tabs.Root>
  ),
};

export const Fill: Story = { ...Default, args: { fill: true } };
export const Secondary: Story = { ...Default, args: { variant: "secondary" } };

export const Disabled: Story = {
  render: (args) => (
    <Tabs.Root defaultValue="a">
      <Tabs.List {...args}>
        <Tabs.Tab value="a">Personal</Tabs.Tab>
        <Tabs.Tab value="b" disabled>Business</Tabs.Tab>
        <Tabs.Tab value="c">Institutional</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a"><p style={body}>Personal.</p></Tabs.Panel>
      <Tabs.Panel value="c"><p style={body}>Institutional.</p></Tabs.Panel>
    </Tabs.Root>
  ),
};

/** Composition: rich tab content needs no extra props. */
export const WithBadge: Story = {
  render: (args) => (
    <Tabs.Root defaultValue="pending">
      <Tabs.List {...args}>
        <Tabs.Tab value="pending">
          Pending <Badge>3</Badge>
        </Tabs.Tab>
        <Tabs.Tab value="done">Completed</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="pending"><p style={body}>3 pending transfers.</p></Tabs.Panel>
      <Tabs.Panel value="done"><p style={body}>No completed transfers.</p></Tabs.Panel>
    </Tabs.Root>
  ),
};
