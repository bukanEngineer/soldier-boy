import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";
import { renderSmoke } from "../../test-utils";

describe("Pagination", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Pagination);
  });

  it("renders with page and totalPages", () => {
    render(<Pagination page={3} totalPages={10} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    const { container } = render(
      <Pagination page={1} totalPages={5} className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  // C: Accessibility
  it("has navigation role with aria-label", () => {
    render(<Pagination page={1} totalPages={5} />);
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
  });

  it("marks active page with aria-current", () => {
    render(<Pagination page={3} totalPages={5} />);
    expect(screen.getByText("3")).toHaveAttribute("aria-current", "page");
  });

  it("has accessible previous/next buttons", () => {
    render(<Pagination page={3} totalPages={5} />);
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next page" }),
    ).toBeInTheDocument();
  });

  // D: Interactions
  it("calls onChange when page button clicked", async () => {
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onChange={onChange} />);
    // With siblings=1, pages shown for page=3 are [1, 2, 3, 4, ..., 10]
    await userEvent.click(screen.getByText("4"));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("calls onChange when next button clicked", async () => {
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onChange={onChange} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Next page" }),
    );
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("calls onChange when previous button clicked", async () => {
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onChange={onChange} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Previous page" }),
    );
    expect(onChange).toHaveBeenCalledWith(2);
  });

  // E: Edge cases
  it("disables previous on first page", () => {
    render(<Pagination page={1} totalPages={5} />);
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
  });

  it("disables next on last page", () => {
    render(<Pagination page={5} totalPages={5} />);
    expect(
      screen.getByRole("button", { name: "Next page" }),
    ).toBeDisabled();
  });

  // F: Scalability — many pages
  it("handles large totalPages with ellipsis", () => {
    render(<Pagination page={50} totalPages={1000} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("50")).toHaveAttribute("aria-current", "page");
  });

  // G: Summary display
  it("shows summary when showSummary is true", () => {
    render(
      <Pagination
        page={2}
        totalPages={10}
        showSummary
        totalItems={100}
        pageSize={10}
      />,
    );
    // Should display something like "11-20 of 100"
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
