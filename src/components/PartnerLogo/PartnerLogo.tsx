import React from "react";
import { LOGO_COMPONENTS, type PartnerLogoSvg } from "./logos/index";
import { cn } from "../../lib/cn";

type LogoComponent = PartnerLogoSvg;
const COMPONENTS = LOGO_COMPONENTS;
type SizedLogoProps = {
  size: number;
  className?: string;
  style?: React.CSSProperties;
};

function bankLogo(Component: LogoComponent) {
  function BankLogo({ size, className, style }: SizedLogoProps) {
    return (
      <Component
        width={size * 1.6}
        height={size}
        aria-hidden="true"
        focusable="false"
        className={className}
        style={style}
      />
    );
  }
  return BankLogo;
}

function squareLogo(Component: LogoComponent) {
  function SquareLogo({ size, className, style }: SizedLogoProps) {
    return (
      <Component
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
        className={className}
        style={style}
      />
    );
  }
  return SquareLogo;
}

const KNOWN_COINS = ["xsgd", "xusd", "xidr", "usdc", "usdt"] as const;
const KNOWN_BANKS = [
  "uob",
  "anz",
  "dbs",
  "standard-chartered",
  "smbc",
  "mandiri",
  "rhb",
  "cimb",
  "bss",
  "cimb-niaga",
  "bni",
  "hana-bank",
  "bri",
  "permata",
  "bca",
  "danamon",
  "bsi",
] as const;
const KNOWN_CHAINS = [
  "ethereum",
  "arbitrum",
  "polygon",
  "metamask",
  "bsc",
  "avalanche",
  "tron",
  "ripple",
  "zilliqa",
  "solana",
  "base",
  "walletconnect",
  "hedera",
] as const;
const KNOWN_PARTNERS = [
  "binance",
  "crypto-com",
  "zillet",
  "qcp-capital",
  "fireblocks",
  "onchain-custodian",
  "uniswap",
  "dextf",
  "coinhako",
  "liquid",
  "tokenize-xchange",
  "bitgo",
  "ledger-vault",
  "unagii",
  "coinstore",
] as const;

const LOGOS: Record<string, React.ComponentType<SizedLogoProps>> = {};
for (const slug of KNOWN_BANKS) {
  if (COMPONENTS[slug]) LOGOS[slug] = bankLogo(COMPONENTS[slug]);
}
for (const slug of [...KNOWN_COINS, ...KNOWN_CHAINS, ...KNOWN_PARTNERS]) {
  if (COMPONENTS[slug]) LOGOS[slug] = squareLogo(COMPONENTS[slug]);
}

function prettify(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export type PartnerLogoProps = {
  name: string;
  size?: number;
  /** Affects the fallback wordmark pill only */
  monochrome?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function PartnerLogo({
  name,
  size = 32,
  monochrome = true,
  className,
  style,
}: PartnerLogoProps) {
  const Custom = LOGOS[name];
  if (Custom) return <Custom size={size} className={className} style={style} />;

  const bg = monochrome ? "transparent" : "var(--surface-secondary)";
  const fg = "var(--text-primary)";
  return (
    <span
      className={cn("partner-logo", className)}
      title={prettify(name)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: size,
        padding: `0 ${Math.max(8, size / 3)}px`,
        background: bg,
        border: `1px solid var(--border)`,
        borderRadius: 4,
        font: `700 ${Math.max(10, size / 2.7)}px/1 var(--font-display)`,
        color: fg,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {prettify(name)}
    </span>
  );
}

PartnerLogo.coins = KNOWN_COINS;
PartnerLogo.banks = KNOWN_BANKS;
PartnerLogo.chains = KNOWN_CHAINS;
PartnerLogo.partners = KNOWN_PARTNERS;
