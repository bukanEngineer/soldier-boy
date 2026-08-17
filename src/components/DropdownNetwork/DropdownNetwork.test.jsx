import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DropdownNetwork } from "./DropdownNetwork";
import { renderSmoke } from "../../test-utils";

describe("DropdownNetwork", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(DropdownNetwork);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <DropdownNetwork
        networks={[
          { id: "eth", name: "Ethereum" },
          { id: "polygon", name: "Polygon" },
        ]}
        selected="eth"
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
