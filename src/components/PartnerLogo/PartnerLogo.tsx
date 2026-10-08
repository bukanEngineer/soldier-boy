import React from "react";
import {
  ArbitrumLogo,
  AvalancheLogo,
  BaseLogo,
  BinanceLogo,
  BscLogo,
  EthereumLogo,
  HederaLogo,
  MetamaskLogo,
  PolygonLogo,
  RippleLogo,
  SolanaLogo,
  TronLogo,
  UsdcLogo,
  UsdtLogo,
  WalletconnectLogo,
  XidrLogo,
  XsgdLogo,
  XusdLogo,
  type PartnerLogoSvg,
} from "./logos/index";
import { cn } from "../../lib/cn";

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

/* Built-in set: the stablecoins and chains the other components (AssetMark)
 * render. Every other logo is imported from `stxdesign-sandbox/logos` and
 * passed through the `logo` prop, so apps only bundle the logos they use. */
const CORE_LOGOS: Record<string, PartnerLogoSvg> = {
  xsgd: XsgdLogo,
  xusd: XusdLogo,
  xidr: XidrLogo,
  usdc: UsdcLogo,
  usdt: UsdtLogo,
  ethereum: EthereumLogo,
  polygon: PolygonLogo,
  arbitrum: ArbitrumLogo,
  base: BaseLogo,
  solana: SolanaLogo,
  tron: TronLogo,
  avalanche: AvalancheLogo,
  bsc: BscLogo,
  ripple: RippleLogo,
  hedera: HederaLogo,
  metamask: MetamaskLogo,
  walletconnect: WalletconnectLogo,
  binance: BinanceLogo,
};

/** Banks are wide lockups (1.6:1); everything else is square. */
function isBank(name: string) {
  return (KNOWN_BANKS as readonly string[]).includes(name);
}

function prettify(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export type PartnerLogoProps = {
  name: string;
  /** Logo component for names outside the built-in set, e.g. `DbsLogo` from `stxdesign-sandbox/logos` */
  logo?: PartnerLogoSvg;
  size?: number;
  /** Affects the fallback wordmark pill only */
  monochrome?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function PartnerLogo({
  name,
  logo,
  size = 32,
  monochrome = true,
  className,
  style,
}: PartnerLogoProps) {
  const Component = logo ?? CORE_LOGOS[name];
  if (Component) {
    return (
      <Component
        width={isBank(name) ? size * 1.6 : size}
        height={size}
        aria-hidden="true"
        focusable="false"
        className={className}
        style={style}
      />
    );
  }

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
