import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu } from "./Menu";

type DemoProps = Partial<React.ComponentProps<typeof Menu.Root>> & {
  popupProps?: Partial<React.ComponentProps<typeof Menu.Popup>>;
};

function Demo({ popupProps, children, ...rootProps }: DemoProps & { children?: React.ReactNode }) {
  return (
    <Menu.Root {...rootProps}>
      <Menu.Trigger>Open Menu</Menu.Trigger>
      <Menu.Popup {...popupProps}>
        {children ?? (
          <>
            <Menu.Item>Edit</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
            <Menu.Separator />
            <Menu.Item variant="critical">Delete</Menu.Item>
          </>
        )}
      </Menu.Popup>
    </Menu.Root>
  );
}

describe("Menu", () => {
  it("renders the trigger and keeps the popup closed", () => {
    render(<Demo />);
    expect(screen.getByRole("button", { name: "Open Menu" })).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens with role=menu and menuitem roles", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "Duplicate" })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
  });

  it("keeps scrollable popups keyboard-focusable", async () => {
    render(<Demo defaultOpen />);
    const menu = await screen.findByRole("menu");
    expect(menu).toHaveAttribute("tabindex", "0");
  });

  it("supports defaultOpen", async () => {
    render(<Demo defaultOpen />);
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("calls onClick when an item is activated and closes", async () => {
    const onClick = vi.fn();
    render(
      <Demo>
        <Menu.Item onClick={onClick}>Action</Menu.Item>
      </Demo>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Action" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("does not activate a disabled item", async () => {
    const onClick = vi.fn();
    render(
      <Demo defaultOpen>
        <Menu.Item onClick={onClick} disabled>
          Disabled
        </Menu.Item>
      </Demo>,
    );
    await screen.findByRole("menu");
    await userEvent.click(screen.getByRole("menuitem", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("moves focus into the popup on open and highlights items with arrow keys", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
    const menu = await screen.findByRole("menu");
    await waitFor(() => expect(menu.contains(document.activeElement)).toBe(true));
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => {
      const highlighted = menu.querySelector("[data-highlighted]");
      expect(highlighted).toBeTruthy();
      expect(highlighted).toHaveAttribute("role", "menuitem");
    });
  });

  it("portals the popup outside overflow:hidden ancestors", async () => {
    const { container } = render(
      <div data-testid="clip" style={{ overflow: "hidden", height: 40 }}>
        <Demo defaultOpen />
      </div>,
    );
    const menu = await screen.findByRole("menu");
    expect(container.querySelector('[data-testid="clip"]')?.contains(menu)).toBe(false);
    expect(document.body.contains(menu)).toBe(true);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Demo />);
    const trigger = screen.getByRole("button", { name: "Open Menu" });
    await userEvent.click(trigger);
    await screen.findByRole("menu");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("renders group labels and separators", async () => {
    render(
      <Demo defaultOpen>
        <Menu.Group>
          <Menu.GroupLabel>Status</Menu.GroupLabel>
          <Menu.Item>Active</Menu.Item>
        </Menu.Group>
        <Menu.Separator data-testid="sep" />
        <Menu.Item>Other</Menu.Item>
      </Demo>,
    );
    await screen.findByRole("menu");
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByTestId("sep")).toBeInTheDocument();
  });

  it("supports radio single-select items", async () => {
    const onValueChange = vi.fn();
    render(
      <Demo defaultOpen>
        <Menu.RadioGroup value="a" onValueChange={onValueChange}>
          <Menu.RadioItem value="a">A</Menu.RadioItem>
          <Menu.RadioItem value="b">B</Menu.RadioItem>
        </Menu.RadioGroup>
      </Demo>,
    );
    await screen.findByRole("menu");
    await userEvent.click(screen.getByRole("menuitemradio", { name: "B" }));
    expect(onValueChange).toHaveBeenCalledWith("b", expect.anything());
  });

  it("supports checkbox multi-select items", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Demo defaultOpen>
        <Menu.CheckboxItem checked={false} onCheckedChange={onCheckedChange}>
          Active
        </Menu.CheckboxItem>
      </Demo>,
    );
    await screen.findByRole("menu");
    await userEvent.click(screen.getByRole("menuitemcheckbox", { name: "Active" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("applies critical variant as a data attribute", async () => {
    render(
      <Demo defaultOpen>
        <Menu.Item variant="critical">Delete</Menu.Item>
      </Demo>,
    );
    await screen.findByRole("menu");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute("data-variant", "critical");
  });

  it("merges className onto the popup", async () => {
    render(<Demo defaultOpen popupProps={{ className: "custom-popup" }} />);
    const menu = await screen.findByRole("menu");
    expect(menu).toHaveClass("menu__popup", "custom-popup");
  });
});
