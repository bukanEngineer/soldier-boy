import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu } from "./Menu";
import { renderSmoke } from "../../test-utils";

describe("Menu", () => {
  const renderMenu = (props = {}) =>
    render(
      <Menu
        trigger={({ onClick, open }) => (
          <button onClick={onClick} aria-expanded={open}>
            Open Menu
          </button>
        )}
        {...props}
      >
        <Menu.Item onSelect={() => {}}>Edit</Menu.Item>
        <Menu.Item onSelect={() => {}}>Duplicate</Menu.Item>
        <Menu.Divider />
        <Menu.Item onSelect={() => {}} tone="critical">
          Delete
        </Menu.Item>
      </Menu>,
    );

  // A: Renderability
  it("renders the trigger", () => {
    renderMenu();
    expect(
      screen.getByRole("button", { name: "Open Menu" }),
    ).toBeInTheDocument();
  });

  it("does not show menu items when closed", () => {
    renderMenu();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the root", () => {
    const { container } = render(
      <Menu
        trigger={({ onClick }) => <button onClick={onClick}>Open</button>}
        className="custom"
      >
        <Menu.Item>Test</Menu.Item>
      </Menu>,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  // C: Accessibility
  it("opens with role=menu on click", async () => {
    renderMenu();
    await userEvent.click(
      screen.getByRole("button", { name: "Open Menu" }),
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("renders menu items with role=menuitem", async () => {
    renderMenu();
    await userEvent.click(
      screen.getByRole("button", { name: "Open Menu" }),
    );
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Duplicate" }),
    ).toBeInTheDocument();
  });

  // D: Interactions
  it("calls onSelect when a menu item is clicked", async () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={({ onClick }) => <button onClick={onClick}>Open</button>}
      >
        <Menu.Item onSelect={onSelect}>Action</Menu.Item>
      </Menu>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Action" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("does not call onSelect on disabled item", async () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={({ onClick }) => <button onClick={onClick}>Open</button>}
      >
        <Menu.Item onSelect={onSelect} disabled>
          Disabled
        </Menu.Item>
      </Menu>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Disabled" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("opens by default when defaultOpen is true", () => {
    render(
      <Menu
        trigger={({ onClick }) => <button onClick={onClick}>Open</button>}
        defaultOpen
      >
        <Menu.Item>Visible</Menu.Item>
      </Menu>,
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  // E: Sub-components
  it("renders Menu.Label", async () => {
    render(
      <Menu
        trigger={({ onClick }) => <button onClick={onClick}>Open</button>}
        defaultOpen
      >
        <Menu.Label>Section</Menu.Label>
        <Menu.Item>Item</Menu.Item>
      </Menu>,
    );
    expect(screen.getByText("Section")).toBeInTheDocument();
  });

  it("renders Menu.Divider", async () => {
    const { container } = render(
      <Menu
        trigger={({ onClick }) => <button onClick={onClick}>Open</button>}
        defaultOpen
      >
        <Menu.Item>A</Menu.Item>
        <Menu.Divider />
        <Menu.Item>B</Menu.Item>
      </Menu>,
    );
    expect(container.querySelector(".menu__divider")).toBeInTheDocument();
  });

  // F: Scalability
  it("renders many menu items without crashing", () => {
    render(
      <Menu
        trigger={({ onClick }) => <button onClick={onClick}>Open</button>}
        defaultOpen
      >
        {Array.from({ length: 50 }, (_, i) => (
          <Menu.Item key={i}>Item {i}</Menu.Item>
        ))}
      </Menu>,
    );
    expect(screen.getByText("Item 0")).toBeInTheDocument();
    expect(screen.getByText("Item 49")).toBeInTheDocument();
  });
});
