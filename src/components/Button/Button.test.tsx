import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("fires onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continue</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Continue
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies the variant and size classes", () => {
    render(
      <Button variant="secondary" size="sm">
        Cancel
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Cancel" });
    expect(button).toHaveClass("btn--secondary", "btn--sm");
  });

  it("renders as another element via render", () => {
    render(
      <Button render={(props) => <a {...props} href="/home" />} nativeButton={false}>
        Home
      </Button>,
    );
    const link = screen.getByRole("button", { name: "Home" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveClass("btn", "btn--primary");
  });

  it("forwards ref to the button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Go</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("exposes data-disabled when disabled", () => {
    render(<Button disabled>Off</Button>);
    expect(screen.getByRole("button", { name: "Off" })).toHaveAttribute("data-disabled");
  });
});
