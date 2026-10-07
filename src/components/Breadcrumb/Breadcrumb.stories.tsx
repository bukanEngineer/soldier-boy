import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./Breadcrumb";

function Trail({ labels }: { labels: string[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {labels.map((label, i) => {
          const isLast = i === labels.length - 1;
          return (
            <React.Fragment key={label}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="#">{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Trail labels={["Home", "Transaction History", "Tx 0x9a1b…"]} />
  ),
};

export const TwoLevels: Story = {
  render: () => <Trail labels={["Settings", "Security"]} />,
};

export const FourItems: Story = {
  render: () => (
    <Trail labels={["Home", "Wallet", "Transactions", "Tx 0x9a1b…"]} />
  ),
};

export const FiveItems: Story = {
  render: () => (
    <Trail labels={["Home", "Wallet", "Transactions", "Deposits", "Tx 0x9a1b…"]} />
  ),
};

export const SixItems: Story = {
  render: () => (
    <Trail
      labels={["Home", "Wallet", "Transactions", "Deposits", "2026", "Tx 0x9a1b…"]}
    />
  ),
};
