import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DropdownAsset } from "./DropdownAsset";
import { renderSmoke } from "../../test-utils";

describe("DropdownAsset", () => {
  it("renders without crashing", () => {
    renderSmoke(DropdownAsset);
  });

  it("renders balance as trailing text", () => {
    const { container } = render(
      <DropdownAsset
        value="eth"
        options={[{ value: "eth", name: "Ethereum", balance: "1.25" }]}
      />,
    );
    expect(container).toHaveTextContent("1.25");
  });
});
