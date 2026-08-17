import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CardSwap } from "./CardSwap";
import { renderSmoke } from "../../test-utils";

describe("CardSwap", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(CardSwap);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <CardSwap
        from={{ currency: "SGD", amount: "100" }}
        to={{ currency: "XSGD", amount: "100" }}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
