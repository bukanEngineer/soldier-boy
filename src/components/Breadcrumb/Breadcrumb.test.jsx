import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumb } from "./Breadcrumb";
import { renderSmoke, generateItems } from "../../test-utils";

describe("Breadcrumb", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Widget", href: "/products/widget" },
  ];

  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Breadcrumb);
  });

  it("renders with items", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Widget")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    const { container } = render(
      <Breadcrumb items={items} className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("renders items with href as links", () => {
    render(<Breadcrumb items={items} />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  // C: Accessibility
  it("has nav role with aria-label", () => {
    render(<Breadcrumb items={items} />);
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
  });

  it("marks last item with aria-current=page", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Widget")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("hides separators from assistive technology", () => {
    const { container } = render(<Breadcrumb items={items} />);
    const separators = container.querySelectorAll("[aria-hidden='true']");
    expect(separators.length).toBeGreaterThan(0);
  });

  // D: Interactions
  it("fires onClick when a breadcrumb item is clicked", async () => {
    const onClick = vi.fn();
    const clickItems = [
      { label: "Home", onClick },
      { label: "Current" },
    ];
    render(<Breadcrumb items={clickItems} />);
    await userEvent.click(screen.getByText("Home"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // E: Scalability — deep nesting
  it("renders many breadcrumb levels without crashing", () => {
    const manyItems = generateItems(20, (i) => ({
      label: `Level ${i}`,
      href: `/level-${i}`,
    }));
    render(<Breadcrumb items={manyItems} />);
    expect(screen.getByText("Level 0")).toBeInTheDocument();
    expect(screen.getByText("Level 19")).toBeInTheDocument();
  });
});
