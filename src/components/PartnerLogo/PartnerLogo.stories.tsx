import React from "react";
import { PartnerLogo } from "./PartnerLogo";
import { AssetMark } from "../AssetMark/AssetMark";
import * as LOGOS from "./logos/index";

/** "standard-chartered" -> StandardCharteredLogo (the generated component) */
const logoFor = (slug: string) =>
  (LOGOS as Record<string, React.ComponentType>)[
    `${slug
      .split("-")
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join("")}Logo`
  ] as React.ComponentProps<typeof PartnerLogo>["logo"];

const markRow = { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" } as const;

export default {
  title: "Foundations/Partner and Web3 Asset",
  component: PartnerLogo,
  subcomponents: { AssetMark },
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        {PartnerLogo.chains.map((slug) => <PartnerLogo key={slug} name={slug} logo={logoFor(slug)} size={32} />)}
      </div>
      <div style={markRow}>
        {["ETH", "POLYGON", "ARBITRUM", "BASE", "SOLANA", "TRON", "BNB", "XRP", "HBAR", "AVAX", "METAMASK", "WALLETCONNECT"].map(
          (a) => <AssetMark key={a} asset={a} />,
        )}
      </div>
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

export const Stablecoins = {
  render: () => (
    <div style={markRow}>
      {["XSGD", "XIDR", "XUSD", "USDC", "USDT"].map((a) => <AssetMark key={a} asset={a} />)}
    </div>
  ),
};

export const Sizes = {
  render: () => (
    <div style={markRow}>
      {[16, 24, 32, 40, 56].map((s) => <AssetMark key={s} asset="XSGD" size={s} />)}
    </div>
  ),
};

export const CustomAndFallback = {
  render: () => (
    <div style={markRow}>
      <AssetMark label="DBS" color="var(--brand-secure-teal)" />
      <AssetMark label="UOB" color="var(--brand-credible-blue)" />
      <AssetMark asset="UNKNOWN" />
    </div>
  ),
};
