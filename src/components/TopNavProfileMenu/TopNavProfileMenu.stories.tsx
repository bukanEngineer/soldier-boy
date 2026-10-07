import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu } from "../Menu/Menu";
import { TopNavProfileMenu } from "./TopNavProfileMenu";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/Top Nav Profile Menu",
  component: TopNavProfileMenu,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 240 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    account: { control: "inline-radio", options: ["personal", "business", "sandbox"] },
  },
  args: {
    account: "personal",
  },
} satisfies Meta<typeof TopNavProfileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ account }: { account: "personal" | "business" | "sandbox" }) {
  return (
    <Menu.Root defaultOpen>
      <Menu.Trigger render={<Button variant="secondary" />}>Account</Menu.Trigger>
      <Menu.Popup className="topnav-menu" align="start">
        <TopNavProfileMenu account={account} onAction={() => {}} />
      </Menu.Popup>
    </Menu.Root>
  );
}

export const Personal: Story = {
  render: () => <Demo account="personal" />,
};

export const Business: Story = {
  render: () => <Demo account="business" />,
};

export const Sandbox: Story = {
  render: () => <Demo account="sandbox" />,
};
