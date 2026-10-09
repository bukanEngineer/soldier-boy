import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AssetMark } from "./AssetMark";
import { ListAsset } from "../ListAsset/ListAsset";
import { CardSummary } from "../CardSummary/CardSummary";
import { ModalAssetSelection } from "../ModalAssetSelection/ModalAssetSelection";
import { ModalAssetOverview } from "../ModalAssetOverview/ModalAssetOverview";
import { InputCurrency } from "../InputCurrency/InputCurrency";
import { InlineCrossAsset } from "../InlineCrossAsset/InlineCrossAsset";

const recipes = [
  {
    name: "asset list",
    markClass: ".list-asset__icon",
    render: (symbol: string, artwork?: React.ReactNode) => (
      <ListAsset symbol={symbol} icon={artwork} />
    ),
  },
  {
    name: "summary",
    markClass: ".card-summary__chip-logo",
    render: (symbol: string, artwork?: React.ReactNode) => (
      <CardSummary conversion={{ from: { label: symbol, logo: artwork } }} />
    ),
  },
  {
    name: "selection dialog",
    markClass: ".asset-sel__mark",
    render: (symbol: string, artwork?: React.ReactNode) => (
      <ModalAssetSelection defaultOpen assets={[{ id: "a", symbol, mark: artwork }]} />
    ),
  },
  {
    name: "overview dialog",
    markClass: ".asset-ov__mark",
    render: (symbol: string, artwork?: React.ReactNode) => (
      <ModalAssetOverview defaultOpen symbol={symbol} mark={artwork} />
    ),
  },
  {
    name: "currency input",
    markClass: ".input-currency__mark",
    render: (symbol: string, artwork?: React.ReactNode) => (
      <InputCurrency aria-label="Amount" asset={{ symbol, logo: artwork }} />
    ),
  },
];

for (const recipe of recipes) {
  describe(`${recipe.name} asset artwork`, () => {
    it.each(["SGD", "XSGD", "ETH", "ethereum"])("resolves %s through AssetMark", (symbol) => {
      const expected = render(<AssetMark asset={symbol} />);
      const art = expected.container.querySelector("svg")!.innerHTML;
      expected.unmount();
      const { baseElement } = render(recipe.render(symbol));
      expect(baseElement.querySelector(`${recipe.markClass} .asset-mark`)).toHaveAttribute(
        "aria-label",
        symbol,
      );
      expect(baseElement.querySelector(`${recipe.markClass} svg`)?.innerHTML).toBe(art);
    });

    it("keeps custom artwork and hides explicit null", () => {
      const { baseElement, rerender } = render(
        recipe.render("SGD", <span data-testid="custom-mark">Custom</span>),
      );
      expect(screen.getByTestId("custom-mark")).toBeInTheDocument();
      expect(baseElement.querySelector(".asset-mark")).toBeNull();
      rerender(recipe.render("SGD", null));
      expect(baseElement.querySelector(recipe.markClass)).toBeNull();
    });

    it("does not assign asset artwork to unknown symbols or generic labels", () => {
      const { baseElement } = render(recipe.render("Reward points"));
      expect(baseElement.querySelector(".asset-mark")).toBeNull();
    });
  });
}

it("keeps fiat and stablecoin artwork distinct", () => {
  const { container } = render(<InlineCrossAsset from="SGD" to="XSGD" />);
  const marks = container.querySelectorAll("svg");
  expect(marks[0].innerHTML).not.toBe(marks[marks.length - 1].innerHTML);
});

it("resolves currency picker options while honoring a selected null override", () => {
  const { container } = render(
    <InputCurrency
      aria-label="Amount"
      asset={{
        defaultValue: "sgd",
        options: [{ value: "sgd", symbol: "SGD", logo: null }],
        logo: <span>Inherited</span>,
      }}
    />,
  );
  expect(container.querySelector(".input-currency__mark")).toBeNull();
  expect(container.querySelector(".input-currency__symbol")).toHaveTextContent("SGD");
});
