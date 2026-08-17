import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";
import {
  renderSmoke,
  assertClassNameForwarding,
  assertPropSpreading,
} from "../../test-utils";

describe("Card", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Card);
  });

  it("renders with all optional props", () => {
    render(
      <Card shadow={2} title="Card Title" body="Card body text">
        <p>Extra content</p>
      </Card>,
    );
    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card body text")).toBeInTheDocument();
    expect(screen.getByText("Extra content")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    assertClassNameForwarding(Card);
  });

  it("spreads HTML attributes onto the section element", () => {
    assertPropSpreading(Card);
  });

  it("renders as a section element", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild.tagName).toBe("SECTION");
  });

  it("applies shadow classes", () => {
    const { container } = render(<Card shadow={3}>Content</Card>);
    expect(container.firstChild).toHaveClass("card--shadow-3");
  });

  it("does not apply shadow class when shadow is false", () => {
    const { container } = render(<Card shadow={false}>Content</Card>);
    expect(container.firstChild).toHaveClass("card");
    expect(container.firstChild.className).not.toContain("shadow");
  });

  // C: Composability
  it("accepts arbitrary children", () => {
    render(
      <Card>
        <form>
          <input type="text" />
          <button>Submit</button>
        </form>
      </Card>,
    );
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  // D: Scalability — nested cards
  it("renders nested cards without crashing", () => {
    const { container } = render(
      <Card>
        {Array.from({ length: 20 }, (_, i) => (
          <Card key={i} title={`Nested ${i}`}>
            Content {i}
          </Card>
        ))}
      </Card>,
    );
    expect(container.querySelectorAll("section")).toHaveLength(21);
  });
});
