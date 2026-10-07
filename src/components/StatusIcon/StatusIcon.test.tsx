import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusIcon } from "./StatusIcon";
import { renderSmoke, assertPropSpreading } from "../../test-utils";

describe("StatusIcon", () => {
  // A: Renderability
  it("renders with no props (defaults to success)", () => {
    renderSmoke(StatusIcon);
  });

  it("renders with variant prop", () => {
    const { container } = render(<StatusIcon variant="needApproval" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    const { container } = render(<StatusIcon className="custom" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes onto the root span", () => {
    assertPropSpreading(StatusIcon);
  });

  it("accepts a custom size", () => {
    const { container } = render(<StatusIcon size={48} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("accepts a custom icon override", () => {
    const { container } = render(<StatusIcon icon="star" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // C: All variants render without crashing
  it("renders success variant", () => {
    const { container } = render(<StatusIcon variant="success" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders needApproval variant", () => {
    const { container } = render(<StatusIcon variant="needApproval" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
