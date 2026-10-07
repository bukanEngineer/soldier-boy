import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DropdownBlockchain } from "./DropdownBlockchain";
import { renderSmoke } from "../../test-utils";

describe("DropdownBlockchain", () => {
  it("renders without crashing", () => {
    renderSmoke(DropdownBlockchain);
  });

  it("maps address to secondary text", () => {
    const { container } = render(
      <DropdownBlockchain
        value="eth"
        options={[{ value: "eth", name: "Ethereum", address: "0x1234…abcd" }]}
      />,
    );
    expect(container).toHaveTextContent("0x1234…abcd");
  });
});
