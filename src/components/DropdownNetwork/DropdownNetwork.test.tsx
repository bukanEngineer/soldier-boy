import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DropdownNetwork } from "./DropdownNetwork";
import { renderSmoke } from "../../test-utils";

describe("DropdownNetwork", () => {
  it("renders without crashing", () => {
    renderSmoke(DropdownNetwork);
  });

  it("renders with common props", () => {
    const { container } = render(
      <DropdownNetwork
        value="eth"
        options={[{ value: "eth", name: "Ethereum", secondary: "ERC-20" }]}
      />,
    );
    expect(container).toHaveTextContent("Ethereum");
  });
});
