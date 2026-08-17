import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FieldNetwork } from "./FieldNetwork";
import { renderSmoke } from "../../test-utils";

describe("FieldNetwork", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(FieldNetwork);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <FieldNetwork
        label="Network"
        network={{ id: "eth", name: "Ethereum" }}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
