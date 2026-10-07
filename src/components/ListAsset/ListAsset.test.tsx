import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListAsset } from "./ListAsset";
import { renderSmoke, generateItems } from "../../test-utils";

describe("ListAsset", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(ListAsset);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <ListAsset
        assets={[
          { id: "xsgd", name: "XSGD", balance: "1,000.00" },
          { id: "usdc", name: "USDC", balance: "500.00" },
        ]}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  // Scalability: many assets
  it("renders 100 assets without crashing", () => {
    const assets = generateItems(100, (i) => ({
      id: `asset-${i}`,
      name: `Asset ${i}`,
      balance: `${i * 100}.00`,
    }));
    const { container } = render(<ListAsset assets={assets} />);
    expect(container.firstChild).not.toBeNull();
  });
});
