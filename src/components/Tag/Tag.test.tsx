import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tag } from "./Tag";
import {
  renderSmoke,
  assertClassNameForwarding,
  assertPropSpreading,
} from "../../test-utils";

describe("Tag", () => {
  // A: Renderability
  it("renders with just children", () => {
    renderSmoke(Tag, { children: "Status" });
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <Tag
        variant="outlined"
        tone="positive"
        size="small"
        icon="check"
        removable
        onRemove={() => {}}
      >
        Approved
      </Tag>,
    );
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    assertClassNameForwarding(Tag, { children: "Test" });
  });

  it("spreads HTML attributes onto the root element", () => {
    assertPropSpreading(Tag, { children: "Test" });
  });

  it("applies variant classes", () => {
    const { container } = render(<Tag variant="new">New</Tag>);
    expect(container.firstChild).toHaveClass("tag--new");
  });

  it("applies tone classes for outlined variant", () => {
    const { container } = render(
      <Tag variant="outlined" tone="critical">
        Error
      </Tag>,
    );
    expect(container.firstChild).toHaveClass("tag--critical");
  });

  it("applies size classes", () => {
    const { container } = render(<Tag size="small">Sm</Tag>);
    expect(container.firstChild).toHaveClass("tag--small");
  });

  // C: Accessibility
  it("renders as a span by default (non-interactive)", () => {
    const { container } = render(<Tag>Info</Tag>);
    expect(container.firstChild.tagName).toBe("SPAN");
  });

  it("renders as a button when clickable", () => {
    render(<Tag clickable>Click me</Tag>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("has aria-pressed when clickable and selected", () => {
    render(
      <Tag clickable selected>
        Active
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "Active" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("remove button has accessible label", () => {
    render(
      <Tag removable onRemove={() => {}}>
        Removable
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  // D: Interactions
  it("fires onClick when clickable", async () => {
    const onClick = vi.fn();
    render(
      <Tag clickable onClick={onClick}>
        Click
      </Tag>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Click" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Tag clickable disabled onClick={onClick}>
        Disabled
      </Tag>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires onRemove when remove button clicked", async () => {
    const onRemove = vi.fn();
    render(
      <Tag removable onRemove={onRemove}>
        Tag
      </Tag>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("does not fire onRemove when disabled", async () => {
    const onRemove = vi.fn();
    render(
      <Tag removable disabled onRemove={onRemove}>
        Tag
      </Tag>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).not.toHaveBeenCalled();
  });

  // E: Scalability — renders many tags without issue
  it("renders 100 tags in a list without crashing", () => {
    const { container } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Tag key={i} tone="info">
            Tag {i}
          </Tag>
        ))}
      </div>,
    );
    expect(container.querySelectorAll(".tag")).toHaveLength(100);
  });
});
