import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  const baseProps = { open: true, onClose: vi.fn() };

  // A: Renderability
  it("renders nothing when closed", () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}}>
        Hidden
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog when open", () => {
    render(
      <Modal {...baseProps} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <Modal
        {...baseProps}
        title="Full Modal"
        size="large"
        variant="illustration"
        illustration={<img data-testid="illust" alt="" />}
        footer={<button>Confirm</button>}
      >
        Body
      </Modal>,
    );
    expect(screen.getByText("Full Modal")).toBeInTheDocument();
    expect(screen.getByTestId("illust")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the modal panel", () => {
    render(
      <Modal {...baseProps} className="custom-modal">
        Content
      </Modal>,
    );
    expect(document.querySelector(".custom-modal")).toBeInTheDocument();
  });

  it("applies size class", () => {
    render(
      <Modal {...baseProps} size="large">
        Content
      </Modal>,
    );
    expect(document.querySelector(".modal--large")).toBeInTheDocument();
  });

  // C: Accessibility
  it("has role=dialog and aria-modal=true", () => {
    render(<Modal {...baseProps}>Content</Modal>);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("has aria-labelledby pointing to the title", () => {
    render(<Modal {...baseProps} title="My Title">Content</Modal>);
    const dialog = screen.getByRole("dialog");
    const titleId = dialog.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();
    expect(document.getElementById(titleId)).toHaveTextContent("My Title");
  });

  it("does not set aria-labelledby when no title", () => {
    render(<Modal {...baseProps}>Content</Modal>);
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
  });

  it("close button has accessible label", () => {
    render(<Modal {...baseProps}>Content</Modal>);
    expect(
      screen.getByRole("button", { name: "Close" }),
    ).toBeInTheDocument();
  });

  // D: Interactions
  it("calls onClose when close button clicked", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        Content
      </Modal>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when scrim clicked (dismissable)", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} dismissable>
        Content
      </Modal>,
    );
    await userEvent.click(document.querySelector(".modal-scrim"));
    expect(onClose).toHaveBeenCalled();
  });

  it("does not show close button when hideClose is true", () => {
    render(
      <Modal {...baseProps} hideClose>
        Content
      </Modal>,
    );
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("hides the close button by default when dismissable=false", () => {
    render(
      <Modal open onClose={vi.fn()} dismissable={false}>
        Content
      </Modal>,
    );
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("keeps the close button on a non-dismissable modal when hideClose={false}", () => {
    render(
      <Modal open onClose={vi.fn()} dismissable={false} hideClose={false}>
        Content
      </Modal>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed (dismissable)", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} dismissable>
        Content
      </Modal>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on Escape when dismissable=false", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} dismissable={false}>
        Content
      </Modal>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not call onClose on scrim click when dismissable=false", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} dismissable={false}>
        Content
      </Modal>,
    );
    await userEvent.click(document.querySelector(".modal-scrim"));
    expect(onClose).not.toHaveBeenCalled();
  });

  // E: Focus management
  it("locks body scroll when open", () => {
    render(<Modal {...baseProps}>Content</Modal>);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when closed", () => {
    const { rerender } = render(<Modal {...baseProps}>Content</Modal>);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Modal open={false} onClose={baseProps.onClose}>Content</Modal>);
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  // E: Composability — complex children
  it("renders complex children (form inside modal)", () => {
    render(
      <Modal {...baseProps} title="Form Modal">
        <form>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
          <button type="submit">Submit</button>
        </form>
      </Modal>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });
});
