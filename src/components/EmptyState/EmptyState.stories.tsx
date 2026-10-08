import React from "react";
import { EmptyState } from "./EmptyState";
import {
  DocumentWithMagnifierIllustration,
  LockIllustration,
} from "../Illustration/illustrations/index";

export default {
  title: "Components/Empty State",
  component: EmptyState,
  parameters: { layout: "padded" },
  args: {
    title: "No Transaction Found",
    description: "You don't have any transactions yet.",
    compact: false,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    compact: { control: "boolean" },
    className: { control: "text" },
  },
};

export const Default = {};
export const Compact = { args: { compact: true } };
export const TransferGated = {
  args: {
    title: "Verify your account and complete the assessment to transact.",
    description: "You won't be able to initiate any transactions until verification is completed.",
  },
};

export const WithIllustration = {
  args: {
    media: <DocumentWithMagnifierIllustration />,
    title: "No transactions found",
    description: "Try a different date range or filter.",
  },
};

export const CompactWithIllustration = {
  args: {
    compact: true,
    media: <LockIllustration />,
    title: "Verify your account to transact",
    description: "You won't be able to initiate transactions until verification is completed.",
  },
};
