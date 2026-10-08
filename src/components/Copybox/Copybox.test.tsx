import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Copybox } from "./Copybox";
import { Field } from "../Field/Field";
import { ToastProvider } from "../Toast/Toast";

let writeText: ReturnType<typeof vi.fn>;

beforeEach(() => {
  writeText = vi.fn().mockResolvedValue(undefined);
  // userEvent.setup() installs its own clipboard stub, so define ours on the navigator directly.
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});

describe("Copybox", () => {
  it("renders the value and a Copy button", () => {
    render(<Copybox value="0x1234abcd" />);
    expect(screen.getByText("0x1234abcd")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("merges className and spreads props on the root", () => {
    render(<Copybox value="v" className="custom" data-testid="root" />);
    const root = screen.getByTestId("root");
    expect(root).toHaveClass("copybox", "custom");
  });

  it("exposes variants as data attributes", () => {
    render(<Copybox value="v" size="sm" multiline invalid data-testid="root" />);
    const root = screen.getByTestId("root");
    expect(root).toHaveAttribute("data-size", "sm");
    expect(root).toHaveAttribute("data-multiline");
    expect(root).toHaveAttribute("data-invalid");
    expect(root).toHaveAttribute("data-action");
  });

  it("hides the button when action is false", () => {
    render(<Copybox value="v" action={false} data-testid="root" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByTestId("root")).not.toHaveAttribute("data-action");
  });

  it("gives the icon-only button an accessible label and hides the icon", () => {
    render(<Copybox value="v" buttonVariant="icon" />);
    const button = screen.getByRole("button", { name: "Copy" });
    expect(button.querySelector(".sx-icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("copies the value, shows the copied state and calls onCopy", async () => {
    const onCopy = vi.fn();
    render(<Copybox value="copy-me" onCopy={onCopy} data-testid="root" />);
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("copy-me");
    expect(onCopy).toHaveBeenCalledWith("copy-me");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByTestId("root")).toHaveAttribute("data-copied");
  });

  it("is keyboard operable", async () => {
    render(<Copybox value="kbd" />);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Copy" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(writeText).toHaveBeenCalledWith("kbd");
  });

  it("shows a Copied toast inside a ToastProvider", async () => {
    render(
      <ToastProvider>
        <Copybox value="toast-me" />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "Notifications" })).toHaveTextContent("Copied"),
    );
  });

  it("renders a decorative leading element", () => {
    render(<Copybox value="v" leading={<img data-testid="logo" alt="" />} />);
    expect(screen.getByTestId("logo").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("middle-truncates long values and keeps the full value in title", () => {
    const value = "0x1234567890abcdef1234567890abcdef";
    render(<Copybox value={value} truncate />);
    expect(screen.getByTitle(value)).toHaveTextContent("0x12345678…90abcdef");
  });

  it("composes with Field for label and helper", () => {
    render(
      <Field.Root invalid data-testid="field">
        <Field.Label nativeLabel={false} render={<div />}>Wallet address</Field.Label>
        <Copybox value="0xabc" />
        <Field.Error match>Invalid address</Field.Error>
      </Field.Root>,
    );
    expect(screen.getByText("Wallet address")).toBeInTheDocument();
    expect(screen.getByText("Invalid address")).toBeInTheDocument();
    expect(screen.getByTestId("field")).toHaveAttribute("data-invalid");
  });

  it("handles very long values", () => {
    const longValue = "x".repeat(5000);
    render(<Copybox value={longValue} />);
    expect(screen.getByText(longValue)).toBeInTheDocument();
  });
});
