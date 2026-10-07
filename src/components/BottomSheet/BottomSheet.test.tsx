import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomSheet } from "./BottomSheet";

type DemoProps = Partial<React.ComponentProps<typeof BottomSheet.Root>> & {
  withClose?: boolean;
};

function Demo({ withClose = true, ...rootProps }: DemoProps) {
  return (
    <BottomSheet.Root {...rootProps}>
      <BottomSheet.Trigger>Open</BottomSheet.Trigger>
      <BottomSheet.Popup className="custom" data-testid="sheet">
        <BottomSheet.Header>
          <BottomSheet.Title>Send to</BottomSheet.Title>
          {withClose && <BottomSheet.Close />}
        </BottomSheet.Header>
        <BottomSheet.Body>
          <BottomSheet.Description>Choose a method.</BottomSheet.Description>
          <input aria-label="Amount" />
        </BottomSheet.Body>
        <BottomSheet.Footer data-testid="foot">
          <BottomSheet.Close>Done</BottomSheet.Close>
        </BottomSheet.Footer>
      </BottomSheet.Popup>
    </BottomSheet.Root>
  );
}

describe("BottomSheet", () => {
  it("renders nothing until opened", () => {
    render(<Demo />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens from the trigger with title and description wired up", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Send to");
    expect(dialog).toHaveAccessibleDescription("Choose a method.");
    expect(dialog).toHaveAttribute("data-open");
    expect(dialog).toHaveAttribute("data-swipe-direction", "down");
  });

  it("merges className and spreads props on the sheet panel", async () => {
    render(<Demo defaultOpen />);
    const sheet = await screen.findByTestId("sheet");
    expect(sheet).toBe(screen.getByRole("dialog"));
    expect(sheet).toHaveClass("bsheet", "custom");
    expect(sheet.querySelector(".bsheet__handle")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("foot")).toHaveClass("bsheet__foot");
  });

  it("is controlled via open + onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Demo open onOpenChange={onOpenChange} />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    rerender(<Demo open={false} onOpenChange={onOpenChange} />);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Demo />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("ignores Escape when dismissable={false} but close buttons still work", async () => {
    const onOpenChange = vi.fn();
    render(<Demo defaultOpen dismissable={false} onOpenChange={onOpenChange} withClose={false} />);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("icon close button has an accessible label", async () => {
    render(<Demo defaultOpen />);
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("bsheet__close");
  });

  it("icon close button is a small IconButton (touch target is extended in CSS)", async () => {
    render(<Demo defaultOpen />);
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("icon-btn", "icon-btn--sm");
  });

  it("text close renders children without the icon button", async () => {
    render(<Demo defaultOpen />);
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Done" })).toHaveClass("bsheet__close-text");
    expect(screen.getByRole("button", { name: "Done" })).not.toHaveClass("icon-btn");
  });

  it("marks the panel when snapPoints are set", async () => {
    const { unmount } = render(<Demo defaultOpen snapPoints={[0.5, 1]} />);
    expect(await screen.findByTestId("sheet")).toHaveAttribute("data-snap-points", "true");
    unmount();
    render(<Demo defaultOpen />);
    expect(await screen.findByTestId("sheet")).not.toHaveAttribute("data-snap-points");
  });

  it("exposes the keyboard inset variable on the viewport by default", async () => {
    render(<Demo defaultOpen />);
    const sheet = await screen.findByTestId("sheet");
    await waitFor(() =>
      expect(sheet.parentElement?.style.getPropertyValue("--drawer-keyboard-inset")).toBe("0px"),
    );
  });

  it("does not wire the keyboard provider when keyboardAware is false", async () => {
    render(
      <BottomSheet.Root defaultOpen>
        <BottomSheet.Popup keyboardAware={false} data-testid="sheet">
          <BottomSheet.Title>Static</BottomSheet.Title>
        </BottomSheet.Popup>
      </BottomSheet.Root>,
    );
    const sheet = await screen.findByTestId("sheet");
    // The provider sets the variable in an effect; give it time to (not) run.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(sheet.parentElement?.style.getPropertyValue("--drawer-keyboard-inset")).toBe("");
  });
});
