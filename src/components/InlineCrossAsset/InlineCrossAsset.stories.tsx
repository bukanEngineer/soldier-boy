import React from "react";
import { InlineCrossAsset } from "./InlineCrossAsset";

export default {
  title: "Patterns/Inline Cross Asset",
  component: InlineCrossAsset,
  parameters: { layout: "padded" },
  argTypes: {
    from: { control: "text" },
    to: { control: "text" },
    caption: { control: "text" },
  },
  args: {
    from: "XUSD",
    to: "USD",
    caption: "Your XUSD will be converted 1:1 to USD",
  },
  decorators: [(S) => <div style={{ maxWidth: 320 }}><S /></div>],
};

export const XusdToUsd = {};
export const UsdToXusd = {
  args: { from: "USD", to: "XUSD", caption: "Your USD will be credited 1:1 to XUSD" },
};
export const SgdToXsgd = {
  args: { from: "SGD", to: "XSGD", caption: "Your SGD will be credited 1:1 to XSGD" },
};
export const XsgdToSgd = {
  args: { from: "XSGD", to: "SGD", caption: "Your XSGD will be converted 1:1 to SGD" },
};
