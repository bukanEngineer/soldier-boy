import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ListBlockchain } from "./ListBlockchain";
import { renderSmoke } from "../../test-utils";

describe("ListBlockchain", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(ListBlockchain);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <ListBlockchain
        networks={[
          { id: "eth", name: "Ethereum", chain: "ERC-20" },
          { id: "polygon", name: "Polygon", chain: "Polygon" },
        ]}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
