import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

type DemoProps = Partial<React.ComponentProps<typeof Modal.Root>> & {
  popupProps?: Partial<React.ComponentProps<typeof Modal.Popup>>;
  withClose?: boolean;
};

function Demo({ popupProps, withClose = true, ...rootProps }: DemoProps) {
  return (
    <Modal.Root {...rootProps}>
      <Modal.Trigger>Open</Modal.Trigger>
      <Modal.Popup {...popupProps}>
        <Modal.Header>
          <Modal.Title>Confirm transfer</Modal.Title>
          {withClose && <Modal.Close />}
        </Modal.Header>
        <Modal.Body>
          <Modal.Description>This action cannot be undone.</Modal.Description>
          <input aria-label="Note" />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>Cancel</Modal.Close>
        </Modal.Footer>
      </Modal.Popup>
    </Modal.Root>
  );
}

describe("Modal", () => {
  it("renders nothing until opened", () => {
    render(<Demo />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens from the trigger and labels the dialog with title and description", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Confirm transfer");
    expect(dialog).toHaveAccessibleDescription("This action cannot be undone.");
    expect(dialog).toHaveAttribute("data-open");
  });

  it("supports defaultOpen (uncontrolled)", async () => {
    render(<Demo defaultOpen />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("is controlled via open + onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Demo open onOpenChange={onOpenChange} />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    // Still open until the parent updates `open`.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    rerender(<Demo open={false} onOpenChange={onOpenChange} />);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("icon close button has an accessible label and closes the modal", async () => {
    render(<Demo defaultOpen />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
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

  it("moves focus into the popup on open", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  });

  it("ignores Escape when dismissable={false} but footer close still works", async () => {
    const onOpenChange = vi.fn();
    render(<Demo defaultOpen dismissable={false} onOpenChange={onOpenChange} withClose={false} />);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it("applies size via data-size and merges className / spreads props on the popup", async () => {
    render(
      <Demo defaultOpen popupProps={{ size: "large", className: "custom", "data-testid": "popup" } as never} />,
    );
    const popup = await screen.findByTestId("popup");
    expect(popup).toHaveClass("modal", "custom");
    expect(popup).toHaveAttribute("data-size", "large");
  });

  it("renders layout parts with their classes and data attributes", async () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Popup>
          <Modal.Header variant="toolbar">
            <Modal.Close />
          </Modal.Header>
          <Modal.Media data-testid="media">img</Modal.Media>
          <Modal.Header variant="centered" data-testid="head">
            <Modal.Illustration data-testid="ill">i</Modal.Illustration>
            <Modal.Title>Done</Modal.Title>
          </Modal.Header>
          <Modal.Body align="center" data-testid="body">Body</Modal.Body>
          <Modal.Footer className="x" data-testid="foot">Foot</Modal.Footer>
        </Modal.Popup>
      </Modal.Root>,
    );
    expect(await screen.findByTestId("media")).toHaveClass("modal__media");
    expect(screen.getByTestId("head")).toHaveAttribute("data-variant", "centered");
    expect(screen.getByTestId("ill")).toHaveClass("modal__illustration");
    expect(screen.getByTestId("body")).toHaveAttribute("data-align", "center");
    expect(screen.getByTestId("foot")).toHaveClass("modal__foot", "x");
    expect(screen.getByRole("heading", { name: "Done" })).toHaveClass("modal__title");
  });

  it("forwards refs", async () => {
    const popupRef = React.createRef<HTMLDivElement>();
    const bodyRef = React.createRef<HTMLDivElement>();
    render(
      <Modal.Root defaultOpen>
        <Modal.Popup ref={popupRef}>
          <Modal.Title>T</Modal.Title>
          <Modal.Body ref={bodyRef}>B</Modal.Body>
        </Modal.Popup>
      </Modal.Root>,
    );
    await screen.findByRole("dialog");
    expect(popupRef.current).toBe(screen.getByRole("dialog"));
    expect(bodyRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("icon close button is a small IconButton with a 48px touch target", async () => {
    render(<Demo defaultOpen />);
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass(
      "icon-btn",
      "icon-btn--sm",
      "icon-btn--touch",
      "modal__close",
    );
  });
});
