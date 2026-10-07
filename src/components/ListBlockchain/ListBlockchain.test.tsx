import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListBlockchain } from "./ListBlockchain";
import { renderSmoke } from "../../test-utils";

describe("ListBlockchain", () => {
  it("renders without crashing", () => {
    renderSmoke(ListBlockchain);
  });

  it("renders name and address", () => {
    render(<ListBlockchain name="Metamask" address="0xabc" />);
    expect(screen.getByText("Metamask")).toBeInTheDocument();
    expect(screen.getByText("0xabc")).toBeInTheDocument();
  });
});
