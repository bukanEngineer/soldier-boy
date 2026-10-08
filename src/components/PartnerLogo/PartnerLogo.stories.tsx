import React from "react";
import { PartnerLogo } from "./PartnerLogo";
import * as LOGOS from "./logos/index";

/** "standard-chartered" -> StandardCharteredLogo (the generated component) */
const logoFor = (slug: string) =>
  (LOGOS as Record<string, React.ComponentType>)[
    `${slug
      .split("-")
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join("")}Logo`
  ] as React.ComponentProps<typeof PartnerLogo>["logo"];

export default {
  title: "Patterns/Partner Logo",
  component: PartnerLogo,
  parameters: { layout: "padded" },
  argTypes: {
    name: { control: "text" },
    size: { control: { type: "range", min: 20, max: 64, step: 2 } },
    monochrome: { control: "boolean" },
  },
  args: { name: "standard-chartered", logo: logoFor("standard-chartered"), size: 32 },
};

export const Fallback = {
  args: { name: "some-unlisted-partner" },
  parameters: { docs: { description: { story: "For names without a logo, PartnerLogo renders a monochrome wordmark pill so layouts stay intact. Stablecoins and the main chains are built in; any other logo is imported from `stxdesign-sandbox/logos` and passed as `logo`." } } },
};

export const Coins = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      {PartnerLogo.coins.map((slug) => <PartnerLogo key={slug} name={slug} logo={logoFor(slug)} size={32} />)}
    </div>
  ),
};

export const Banks = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      {PartnerLogo.banks.map((slug) => <PartnerLogo key={slug} name={slug} logo={logoFor(slug)} size={40} />)}
    </div>
  ),
};

export const Blockchains = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      {PartnerLogo.chains.map((slug) => <PartnerLogo key={slug} name={slug} logo={logoFor(slug)} size={32} />)}
    </div>
  ),
};

export const Partners = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      {PartnerLogo.partners.map((slug) => <PartnerLogo key={slug} name={slug} logo={logoFor(slug)} size={32} />)}
    </div>
  ),
};
