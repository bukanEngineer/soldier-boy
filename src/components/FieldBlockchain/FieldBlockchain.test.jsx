import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FieldBlockchain } from "./FieldBlockchain";
import { renderSmoke } from "../../test-utils";

describe("FieldBlockchain", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(FieldBlockchain);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <FieldBlockchain
        label="Blockchain"
        network={{ id: "eth", name: "Ethereum", chain: "ERC-20" }}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
