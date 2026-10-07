import React from "react";
import { StatusIcon } from "./StatusIcon";

export default {
  title: "Atoms/Status Icon",
  component: StatusIcon,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "inline-radio", options: ["success", "needApproval"] },
    size: { control: { type: "number" } },
  },
  args: { variant: "success", size: 36 },
};

export const Success = { args: { variant: "success" } };
export const NeedApproval = { args: { variant: "needApproval" } };

export const Sizes = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <StatusIcon variant="success" size={24} />
      <StatusIcon variant="success" size={36} />
      <StatusIcon variant="needApproval" size={48} />
    </div>
  ),
};
