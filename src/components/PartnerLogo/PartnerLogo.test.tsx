import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PartnerLogo } from "./PartnerLogo";
import { AssetMark } from "../AssetMark/AssetMark";
import * as LOGOS from "./logos/index";
import { DbsLogo } from "./logos/index";

/** "standard-chartered" -> StandardChartered (generated component: StandardCharteredLogo) */
function logoFor(slug: string) {
  const pascal = slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
  return (LOGOS as Record<string, LogoComponent>)[`${pascal}Logo`];
}
type LogoComponent = (typeof LOGOS)["DbsLogo"];

// Names the component renders without a `logo` prop (see CORE_LOGOS).
const BUILT_IN = ["xsgd", "xusd", "xidr", "usdc", "usdt", "ethereum", "polygon", "binance"];

// Regression guard for the bundler-compatibility bug this component used to
// have: logos were previously loaded via `new URL(..., import.meta.url)`
// and rendered as `<img src="...">`, which most bundlers (Webpack/Next.js,
// and even Vite for templated paths) can't statically resolve — consumers
// would get a broken image. Logos are now inlined as real SVG JSX, so these
// assertions check for actual <svg><path> markup and the absence of any
// <img>/file-URL indirection.
describe("PartnerLogo", () => {
  it.each([
    ...PartnerLogo.coins,
    ...PartnerLogo.banks,
    ...PartnerLogo.chains,
    ...PartnerLogo.partners,
  ])("renders %s as an inline <svg>, not an <img>", (slug) => {
    const { container } = render(<PartnerLogo name={slug} logo={logoFor(slug)} size={32} />);
    const svg = container.querySelector("svg");
    expect(svg, `expected ${slug} to render an inline <svg>`).toBeTruthy();
    expect(svg.querySelector("path, circle, rect, g")).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
  });

  it.each(BUILT_IN)("renders %s without a `logo` prop", (slug) => {
    const { container } = render(<PartnerLogo name={slug} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("falls back to the pill for logos outside the built-in set unless `logo` is passed", () => {
    const { container } = render(<PartnerLogo name="dbs" />);
    expect(container.querySelector("svg")).toBeNull();
    expect(container.textContent).toContain("Dbs");
  });

  it("every slug in the exported lists has a generated logo", () => {
    for (const slug of [
      ...PartnerLogo.coins,
      ...PartnerLogo.banks,
      ...PartnerLogo.chains,
      ...PartnerLogo.partners,
    ]) {
      expect(logoFor(slug), `missing generated logo for ${slug}`).toBeTruthy();
    }
  });

  it("renders a fallback pill (not a broken image) for unregistered names", () => {
    const { container } = render(<PartnerLogo name="some-unlisted-partner" />);
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("Some Unlisted Partner");
  });

  it("sizes bank logos as a wide lockup and everything else square", () => {
    const { container: bank } = render(<PartnerLogo name="dbs" logo={DbsLogo} size={40} />);
    const bankSvg = bank.querySelector("svg");
    expect(bankSvg.getAttribute("width")).toBe(String(40 * 1.6));
    expect(bankSvg.getAttribute("height")).toBe("40");

    const { container: coin } = render(<PartnerLogo name="xsgd" size={40} />);
    const coinSvg = coin.querySelector("svg");
    expect(coinSvg.getAttribute("width")).toBe("40");
    expect(coinSvg.getAttribute("height")).toBe("40");
  });
});

describe("AssetMark", () => {
  it.each(["XSGD", "USDC", "ETH", "POLYGON", "SOLANA"])(
    "renders the %s network/stablecoin mark as an inline <svg>",
    (asset) => {
      const { container } = render(<AssetMark asset={asset} />);
      expect(container.querySelector("svg")).toBeTruthy();
      expect(container.querySelector("img")).toBeNull();
    },
  );
});
