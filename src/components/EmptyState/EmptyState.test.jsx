import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";
import { renderSmoke, assertClassNameForwarding } from "../../test-utils";

describe("EmptyState", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(EmptyState);
  });

  it("renders with all optional props", () => {
    render(
      <EmptyState
        title="No transactions yet"
        sub="Start by making your first transfer"
        compact
      />,
    );
    expect(screen.getByText("No transactions yet")).toBeInTheDocument();
    expect(
      screen.getByText("Start by making your first transfer"),
    ).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    assertClassNameForwarding(EmptyState);
  });

  it("renders title when provided", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<EmptyState sub="Try again later" />);
    expect(screen.getByText("Try again later")).toBeInTheDocument();
  });
});
