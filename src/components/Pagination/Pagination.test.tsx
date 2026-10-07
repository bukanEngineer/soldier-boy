import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination, PaginationNav } from "./Pagination";
import { renderSmoke } from "../../test-utils";

describe("Pagination", () => {
  it("renders with no props", () => {
    renderSmoke(Pagination);
  });

  it("PaginationNav renders with page and totalPages", () => {
    render(<PaginationNav page={3} totalPages={10} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("forwards className", () => {
    const { container } = render(
      <PaginationNav page={1} totalPages={5} className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("has navigation role with aria-label", () => {
    render(<PaginationNav page={1} totalPages={5} />);
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
  });

  it("marks active page with aria-current", () => {
    render(<PaginationNav page={3} totalPages={5} />);
    expect(screen.getByText("3")).toHaveAttribute("aria-current", "page");
  });

  it("has accessible previous/next buttons", () => {
    render(<PaginationNav page={3} totalPages={5} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next page" })).toBeInTheDocument();
  });

  it("calls onPageChange when page button clicked", async () => {
    const onPageChange = vi.fn();
    render(<PaginationNav page={3} totalPages={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByText("4"));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange when next button clicked", async () => {
    const onPageChange = vi.fn();
    render(<PaginationNav page={3} totalPages={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange when previous button clicked", async () => {
    const onPageChange = vi.fn();
    render(<PaginationNav page={3} totalPages={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables previous on first page", () => {
    render(<PaginationNav page={1} totalPages={5} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  it("disables next on last page", () => {
    render(<PaginationNav page={5} totalPages={5} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("handles large totalPages with ellipsis", () => {
    render(<PaginationNav page={50} totalPages={1000} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("50")).toHaveAttribute("aria-current", "page");
  });

  it("shows summary when showSummary is true", () => {
    render(
      <PaginationNav
        page={2}
        totalPages={10}
        showSummary
        totalItems={100}
        pageSize={10}
      />,
    );
    expect(screen.getByText(/11–20 of 100/)).toBeInTheDocument();
  });
});
