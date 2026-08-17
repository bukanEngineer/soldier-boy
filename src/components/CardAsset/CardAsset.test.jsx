import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CardAsset } from "./CardAsset";
import { renderSmoke } from "../../test-utils";

describe("CardAsset", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(CardAsset);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <CardAsset
        name="XSGD"
        balance="1,000.00"
        currency="SGD"
        icon="xsgd"
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
