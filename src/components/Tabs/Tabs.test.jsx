import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";
import { renderSmoke } from "../../test-utils";

const defaultItems = [
  { id: "tab1", label: "Overview", content: <p>Overview content</p> },
  { id: "tab2", label: "Details", content: <p>Details content</p> },
  { id: "tab3", label: "Settings", content: <p>Settings content</p> },
];

describe("Tabs", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Tabs);
  });

  it("renders with items", () => {
    render(<Tabs items={defaultItems} />);
    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Settings" })).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to root", () => {
    const { container } = render(
      <Tabs items={defaultItems} className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("applies variant class", () => {
    const { container } = render(
      <Tabs items={defaultItems} variant="secondary" />,
    );
    expect(container.querySelector(".tabs--secondary")).toBeInTheDocument();
  });

  it("applies fill class", () => {
    const { container } = render(<Tabs items={defaultItems} fill />);
    expect(container.querySelector(".tabs--fill")).toBeInTheDocument();
  });

  // C: Accessibility
  it("renders tablist role", () => {
    render(<Tabs items={defaultItems} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("marks active tab with aria-selected", () => {
    render(<Tabs items={defaultItems} activeTab="tab2" />);
    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("renders tabpanel for active content", () => {
    render(<Tabs items={defaultItems} activeTab="tab1" />);
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    expect(screen.getByText("Overview content")).toBeInTheDocument();
  });

  it("supports disabled tabs", () => {
    const items = [
      ...defaultItems.slice(0, 2),
      { id: "tab3", label: "Disabled", content: <p>No</p>, disabled: true },
    ];
    render(<Tabs items={items} />);
    expect(screen.getByRole("tab", { name: "Disabled" })).toBeDisabled();
  });

  // D: Interactions
  it("fires onTabChange when a tab is clicked", async () => {
    const onTabChange = vi.fn();
    render(<Tabs items={defaultItems} onTabChange={onTabChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Details" }));
    expect(onTabChange).toHaveBeenCalledWith("tab2");
  });

  it("does not fire onTabChange for disabled tab", async () => {
    const onTabChange = vi.fn();
    const items = [
      ...defaultItems.slice(0, 2),
      { id: "tab3", label: "Disabled", content: <p>No</p>, disabled: true },
    ];
    render(<Tabs items={items} onTabChange={onTabChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Disabled" }));
    expect(onTabChange).not.toHaveBeenCalled();
  });

  // E: Uncontrolled mode
  it("activates first tab by default", () => {
    render(<Tabs items={defaultItems} />);
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Overview content")).toBeInTheDocument();
  });

  it("switches panels in uncontrolled mode", async () => {
    render(<Tabs items={defaultItems} />);
    await userEvent.click(screen.getByRole("tab", { name: "Settings" }));
    expect(screen.getByText("Settings content")).toBeInTheDocument();
  });

  // F: Scalability — many tabs
  it("renders many tabs without crashing", () => {
    const manyItems = Array.from({ length: 30 }, (_, i) => ({
      id: `t${i}`,
      label: `Tab ${i}`,
      content: <p>Content {i}</p>,
    }));
    render(<Tabs items={manyItems} />);
    expect(screen.getByRole("tab", { name: "Tab 0" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 29" })).toBeInTheDocument();
  });
});
