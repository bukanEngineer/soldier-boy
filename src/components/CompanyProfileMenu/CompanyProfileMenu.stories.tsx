import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu } from "../Menu/Menu";
import { CompanyProfileMenu } from "./CompanyProfileMenu";
import { Button } from "../Button/Button";

const companies = [
  { id: "abc", name: "ABC Pte. Ltd", type: "Business Account", selected: true },
  { id: "xyz", name: "XYZ Pte. Ltd", type: "Business Account" },
];

const meta = {
  title: "Components/Company Profile Menu",
  component: CompanyProfileMenu,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompanyProfileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo(props: React.ComponentProps<typeof CompanyProfileMenu>) {
  return (
    <Menu.Root defaultOpen>
      <Menu.Trigger render={<Button variant="secondary" />}>Company</Menu.Trigger>
      <Menu.Popup className="company-menu" side="bottom" align="start">
        <CompanyProfileMenu {...props} />
      </Menu.Popup>
    </Menu.Root>
  );
}

export const Default: Story = {
  render: () => <Demo onAction={() => {}} />,
};

export const WithSwitchCompany: Story = {
  render: () => (
    <Demo switchCompany companies={companies} onSwitch={() => {}} onAction={() => {}} />
  ),
};

export const SwitchOnly: Story = {
  render: () => (
    <Demo switchCompany companies={companies} actions={[]} onSwitch={() => {}} />
  ),
};
