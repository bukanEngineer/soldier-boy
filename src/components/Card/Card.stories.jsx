import React from "react";
import { Card } from "./Card";
import { Button } from "../Button/Button";
import { Tag } from "../Tag/Tag";

export default {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    shadow: { control: "inline-radio", options: [false, 1, 2, 3] },
    title: { control: "text" },
    body: { control: "text" },
  },
  args: {
    shadow: false,
    title: "Verify Your Identity",
    body: "Complete identity verification for a smooth and secure experience.",
  },
};

export const Default = { decorators: [(S) => <div style={{maxWidth: 360}}><S /></div>] };
export const Shadow1 = { args: { shadow: 1 }, decorators: [(S) => <div style={{maxWidth: 360, background: '#F1F2F4', padding: 24}}><S /></div>] };
export const Shadow2 = { args: { shadow: 2 }, decorators: [(S) => <div style={{maxWidth: 360, background: '#F1F2F4', padding: 24}}><S /></div>] };
export const Shadow3 = { args: { shadow: 3 }, decorators: [(S) => <div style={{maxWidth: 360, background: '#F1F2F4', padding: 24}}><S /></div>] };

export const WithChildren = {
  args: { title: "Verify Your Identity", body: "Complete identity verification for a smooth and secure experience." },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Card {...args}>
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <Tag tone="positive">Verified</Tag>
          <Button size="sm" variant="tertiary">Edit</Button>
        </div>
      </Card>
    </div>
  ),
};
