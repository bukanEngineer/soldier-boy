import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListBank } from "./ListBank";
import { renderSmoke } from "../../test-utils";

describe("ListBank", () => {
  it("renders without crashing", () => {
    renderSmoke(ListBank);
  });

  it("renders name and account", () => {
    render(<ListBank name="Jane" account="DBS - 123" variant="verified" />);
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("DBS - 123")).toBeInTheDocument();
  });
});
