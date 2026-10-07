import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListSupportedNetwork } from "./ListSupportedNetwork";
import { renderSmoke } from "../../test-utils";

describe("ListSupportedNetwork", () => {
  it("renders without crashing", () => {
    renderSmoke(ListSupportedNetwork);
  });

  it("shows overflow count", () => {
    render(<ListSupportedNetwork networks={[<span key="a">A</span>]} overflow={3} />);
    expect(screen.getByText("+3")).toBeInTheDocument();
  });
});
