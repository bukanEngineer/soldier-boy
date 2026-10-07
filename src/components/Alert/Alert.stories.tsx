import React from "react";
import { Alert } from "./Alert";
import { Button } from "../Button/Button";

export default {
  title: "Components/Alert",
  component: Alert,
  parameters: { layout: "padded" },
  args: { tone: "info", title: "Heads up", children: "Your assessment is due in 3 days." },
  argTypes: {
    tone: { control: "inline-radio", options: ["positive", "critical", "warning", "info", "neutral"] },
  },
  decorators: [(S) => <div style={{ maxWidth: 560 }}><S /></div>],
};

export const Info = {};
export const Positive = { args: { tone: "positive", title: "Verified", children: "Your identity has been verified." } };
export const Critical = { args: { tone: "critical", title: "Transfer failed", children: "The recipient address is invalid." } };
export const Warning = { args: { tone: "warning", title: "Pending approval", children: "Large transfers require additional review." } };
export const Neutral = { args: { tone: "neutral", title: "Maintenance window", children: "Mint will be unavailable Sat 02:00–04:00 SGT." } };

export const WithActions = {
  args: {
    tone: "warning",
    title: "Assessment expiring",
    children: "Your customer knowledge assessment expires on 31 Dec 2026. Re-take it now to keep using StraitsX.",
    actions: (
      <>
        <Button size="sm" variant="primary">Take Assessment</Button>
        <Button size="sm" variant="tertiary">Remind me later</Button>
      </>
    ),
  },
};

export const CTABottom = {
  args: {
    tone: "warning",
    title: "Assessment expiring",
    children: "Your customer knowledge assessment expires on 31 Dec 2026.",
    actionPlacement: "bottom",
    actions: (
      <>
        <Button size="sm" variant="primary">Take Assessment</Button>
        <Button size="sm" variant="tertiary">Remind me later</Button>
      </>
    ),
  },
};

export const CTARight = {
  args: {
    tone: "info",
    title: "Verification pending",
    children: "Complete your identity verification to raise your limits.",
    actionPlacement: "inline",
    actions: <Button size="sm" variant="primary">Verify</Button>,
  },
};

export const Dismissible = {
  args: { onDismiss: () => {} },
};
