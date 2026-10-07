import React from "react";
import { List, ListItem } from "./List";
import { AssetMark } from "../AssetMark/AssetMark";
import { LinkButton } from "../LinkButton/LinkButton";

export default {
  title: "Patterns/List/List",
  component: List,
  parameters: { layout: "padded" },
  argTypes: { divided: { control: "boolean" } },
  decorators: [(S) => <div style={{ maxWidth: 420 }}><S /></div>],
};

export const Basic = {
  render: (args) => (
    <List {...args}>
      <ListItem
        leading={<AssetMark asset="XSGD" />}
        title="XSGD"
        description="1:1 to SGD"
        trailing={<LinkButton size="md">Manage</LinkButton>}
      />
      <ListItem
        leading={<AssetMark asset="XUSD" />}
        title="XUSD"
        description="1:1 to USD"
        trailing={<LinkButton size="md">Manage</LinkButton>}
      />
    </List>
  ),
};

export const Divided = {
  ...Basic,
  args: { divided: true },
};

/** `ListItem` outside a `List` renders a plain <div>. */
export const Standalone = {
  render: () => <ListItem title="Standalone row" description="Not inside a List" />,
};
