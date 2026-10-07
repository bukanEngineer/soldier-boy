import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationNav } from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: PaginationNav,
  parameters: { layout: "padded" },
  argTypes: {
    page: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    showSummary: { control: "boolean" },
  },
  args: {
    page: 1,
    totalPages: 10,
    showSummary: false,
  },
} satisfies Meta<typeof PaginationNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [p, setP] = useState(6);
    return <PaginationNav page={p} totalPages={24} onPageChange={setP} />;
  },
};

export const WithSummary: Story = {
  render: () => {
    const [p, setP] = useState(2);
    return (
      <PaginationNav
        page={p}
        totalPages={12}
        pageSize={25}
        totalItems={300}
        onPageChange={setP}
        showSummary
      />
    );
  },
};

export const Few: Story = {
  render: () => {
    const [p, setP] = useState(2);
    return <PaginationNav page={p} totalPages={5} onPageChange={setP} />;
  },
};

export const Edge: Story = {
  render: () => {
    const [p, setP] = useState(1);
    return <PaginationNav page={p} totalPages={24} onPageChange={setP} />;
  },
};
