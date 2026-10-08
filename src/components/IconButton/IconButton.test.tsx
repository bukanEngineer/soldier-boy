import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "./IconButton";
import {
  renderSmoke,
  assertClassNameForwarding,
  assertPropSpreading,
} from "../../test-utils";

describe("IconButton", () => {
  const baseProps = { icon: "close", label: "Close" };

  it("renders with minimal required props", () => {
    renderSmoke(IconButton, baseProps);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <IconButton
        icon="settings"
        label="Settings"
        variant="primary"
        shape="square"
        size="sm"
        disabled
      />,
    );
    expect(screen.getByRole("button", { name: "Settings" })).toBeDisabled();
  });

  it("forwards className to the root element", () => {
    assertClassNameForwarding(IconButton, baseProps);
  });

  it("spreads HTML attributes onto the button", () => {
    assertPropSpreading(IconButton, baseProps);
  });

  it("applies variant classes", () => {
    render(<IconButton icon="edit" label="Edit" variant="primary" />);
    expect(screen.getByRole("button", { name: "Edit" })).toHaveClass("icon-btn--primary");
  });

  it("applies shape classes", () => {
    render(<IconButton icon="edit" label="Edit" shape="square" />);
    expect(screen.getByRole("button", { name: "Edit" })).toHaveClass("icon-btn--square");
  });

  it("applies size classes", () => {
    render(<IconButton icon="edit" label="Edit" size="sm" />);
    expect(screen.getByRole("button", { name: "Edit" })).toHaveClass("icon-btn--sm");
  });

  it("has aria-label from the label prop", () => {
    render(<IconButton icon="delete" label="Delete item" />);
    expect(screen.getByRole("button", { name: "Delete item" })).toBeInTheDocument();
  });

  it("hides the icon from assistive technology", () => {
    const { container } = render(<IconButton icon="close" label="Close" />);
    const iconSpan = container.querySelector(".sx-icon");
    expect(iconSpan).toHaveAttribute("aria-hidden", "true");
  });

  it("fires onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<IconButton icon="close" label="Close" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(<IconButton icon="close" label="Close" disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("is keyboard accessible via Enter and Space", async () => {
    const onClick = vi.fn();
    render(<IconButton icon="close" label="Close" onClick={onClick} />);
    screen.getByRole("button", { name: "Close" }).focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("adds the touch-target class only when touchTarget is set", () => {
    const { rerender } = render(<IconButton {...baseProps} size="sm" />);
    expect(screen.getByRole("button", { name: "Close" })).not.toHaveClass("icon-btn--touch");
    rerender(<IconButton {...baseProps} size="sm" touchTarget />);
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("icon-btn--sm", "icon-btn--touch");
  });
});
