import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LinkButton } from "./LinkButton";
import {
  renderSmoke,
  assertClassNameForwarding,
  assertPropSpreading,
} from "../../test-utils";

describe("LinkButton", () => {
  it("renders with minimal props (just children)", () => {
    renderSmoke(LinkButton, { children: "Learn more" });
    expect(screen.getByRole("button", { name: "Learn more" })).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <LinkButton size="lg" onDark trailingIcon="arrow_forward" leadingIcon="link" disabled>
        Visit
      </LinkButton>,
    );
    expect(screen.getByRole("button", { name: /Visit/ })).toBeDisabled();
  });

  it("forwards className to the root element", () => {
    assertClassNameForwarding(LinkButton, { children: "Click" });
  });

  it("spreads HTML attributes onto the button", () => {
    assertPropSpreading(LinkButton, { children: "Click" });
  });

  it("applies size classes", () => {
    render(<LinkButton size="lg">Large</LinkButton>);
    expect(screen.getByRole("button", { name: "Large" })).toHaveClass("link-btn--lg");
  });

  it("renders as a custom element via the `as` prop", () => {
    render(
      <LinkButton as="a" href="/docs">
        Docs
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveClass("link-btn");
  });

  it("does not apply disabled attribute when rendered as non-button element", () => {
    const { container } = render(
      <LinkButton as="a" href="/docs" disabled>
        Docs
      </LinkButton>,
    );
    const link = container.querySelector("a");
    expect(link).not.toHaveAttribute("disabled");
  });

  it("defaults to type=button for button elements", () => {
    render(<LinkButton>Click</LinkButton>);
    expect(screen.getByRole("button", { name: "Click" })).toHaveAttribute("type", "button");
  });

  it("fires onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<LinkButton onClick={onClick}>Click me</LinkButton>);
    await userEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <LinkButton onClick={onClick} disabled>
        Click me
      </LinkButton>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
