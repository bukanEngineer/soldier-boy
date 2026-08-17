import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomSheet } from "./BottomSheet";

describe("BottomSheet", () => {
  const baseProps = { open: true, onClose: vi.fn() };

  // A: Renderability
  it("renders nothing when closed", () => {
    render(
      <BottomSheet open={false} onClose={() => {}}>
        Hidden
      </BottomSheet>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog when open", () => {
    render(
      <BottomSheet {...baseProps} title="Sheet Title">
        <p>Sheet content</p>
      </BottomSheet>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Sheet Title")).toBeInTheDocument();
    expect(screen.getByText("Sheet content")).toBeInTheDocument();
  });

  it("renders with footer", () => {
    render(
      <BottomSheet {...baseProps} footer={<button>Done</button>}>
        Content
      </BottomSheet>,
    );
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the sheet panel", () => {
    render(
      <BottomSheet {...baseProps} className="custom-sheet">
        Content
      </BottomSheet>,
    );
    expect(document.querySelector(".custom-sheet")).toBeInTheDocument();
  });

  // C: Accessibility
  it("has role=dialog and aria-modal=true on the sheet panel", () => {
    render(<BottomSheet {...baseProps} title="Test">Content</BottomSheet>);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveClass("bsheet");
  });

  it("has aria-labelledby pointing to the title", () => {
    render(<BottomSheet {...baseProps} title="My Title">Content</BottomSheet>);
    const dialog = screen.getByRole("dialog");
    const titleId = dialog.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();
    const titleEl = document.getElementById(titleId);
    expect(titleEl).toHaveTextContent("My Title");
  });

  it("does not set aria-labelledby when no title", () => {
    render(<BottomSheet {...baseProps}>Content</BottomSheet>);
    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toHaveAttribute("aria-labelledby");
  });

  it("close button has accessible label", () => {
    render(<BottomSheet {...baseProps}>Content</BottomSheet>);
    expect(
      screen.getByRole("button", { name: "Close" }),
    ).toBeInTheDocument();
  });

  // D: Interactions
  it("calls onClose when close button clicked", async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose}>
        Content
      </BottomSheet>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when scrim clicked (dismissable)", async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} dismissable>
        Content
      </BottomSheet>,
    );
    await userEvent.click(document.querySelector(".bsheet-scrim"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when Escape is pressed (dismissable)", async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} dismissable>
        Content
      </BottomSheet>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on scrim click when dismissable=false", async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} dismissable={false}>
        Content
      </BottomSheet>,
    );
    await userEvent.click(document.querySelector(".bsheet-scrim"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not call onClose on Escape when dismissable=false", async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} dismissable={false}>
        Content
      </BottomSheet>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not show close button when hideClose is true", () => {
    render(
      <BottomSheet {...baseProps} hideClose>
        Content
      </BottomSheet>,
    );
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("hides the close button by default when dismissable=false", () => {
    render(
      <BottomSheet open onClose={vi.fn()} dismissable={false}>
        Content
      </BottomSheet>,
    );
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("keeps the close button on a non-dismissable sheet when hideClose={false}", () => {
    render(
      <BottomSheet open onClose={vi.fn()} dismissable={false} hideClose={false}>
        Content
      </BottomSheet>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  // E: Focus management
  it("locks body scroll when open", () => {
    render(<BottomSheet {...baseProps}>Content</BottomSheet>);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when closed", () => {
    const { rerender } = render(<BottomSheet {...baseProps}>Content</BottomSheet>);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<BottomSheet open={false} onClose={baseProps.onClose}>Content</BottomSheet>);
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  // F: Composability — rich content / slots
  it("renders complex children", () => {
    render(
      <BottomSheet {...baseProps} title="Options">
        <ul>
          <li>Option A</li>
          <li>Option B</li>
          <li>Option C</li>
        </ul>
      </BottomSheet>,
    );
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  it("renders interactive form elements as children", () => {
    render(
      <BottomSheet {...baseProps} title="Form Sheet">
        <form>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
          <select aria-label="Country">
            <option>USA</option>
            <option>Canada</option>
          </select>
        </form>
      </BottomSheet>,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });

  it("renders nested components as children", () => {
    function CustomCard({ label }) {
      return <div data-testid="custom-card">{label}</div>;
    }
    render(
      <BottomSheet {...baseProps} title="Cards">
        <CustomCard label="Card 1" />
        <CustomCard label="Card 2" />
      </BottomSheet>,
    );
    const cards = screen.getAllByTestId("custom-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Card 1");
    expect(cards[1]).toHaveTextContent("Card 2");
  });

  it("renders different content types in the same slot", () => {
    render(
      <BottomSheet {...baseProps}>
        <p>Paragraph text</p>
        <img src="placeholder.png" alt="Preview" />
        <button>Action</button>
      </BottomSheet>,
    );
    expect(screen.getByText("Paragraph text")).toBeInTheDocument();
    expect(screen.getByAltText("Preview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  // G: Title is optional
  it("renders without a title", () => {
    render(<BottomSheet {...baseProps}>Content without title</BottomSheet>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Content without title")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders with only footer and no title", () => {
    render(
      <BottomSheet {...baseProps} footer={<button>Confirm</button>}>
        Body content
      </BottomSheet>,
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });
});
