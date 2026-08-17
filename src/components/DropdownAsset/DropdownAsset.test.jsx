import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DropdownAsset } from "./DropdownAsset";
import { renderSmoke } from "../../test-utils";

describe("DropdownAsset", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(DropdownAsset);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <DropdownAsset
        assets={[
          { id: "xsgd", name: "XSGD", balance: "1000" },
          { id: "usdc", name: "USDC", balance: "500" },
        ]}
        selected="xsgd"
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
