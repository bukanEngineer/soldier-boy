import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { List } from "../List/List";
import { ListBank } from "./ListBank";
import { renderSmoke } from "../../test-utils";

describe("ListBank", () => {
  it("renders without crashing", () => {
    renderSmoke(ListBank);
  });

  it("renders name and account", () => {
    render(<ListBank name="Jane" account="DBS - 123" variant="verified" />);
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("DBS - 123")).toBeInTheDocument();
  });

  it("shows swift only when verified", () => {
    const { rerender } = render(<ListBank account="A" swift="UOVBSGSG" variant="verified" />);
    expect(screen.getByText("UOVBSGSG")).toBeInTheDocument();
    rerender(<ListBank account="A" swift="UOVBSGSG" variant="unverified" />);
    expect(screen.queryByText("UOVBSGSG")).toBeNull();
  });

  it("offers Verify / Resubmit and no action when verified", async () => {
    const onAction = vi.fn();
    const { rerender } = render(<ListBank variant="unverified" onAction={onAction} />);
    await userEvent.click(screen.getByRole("button", { name: "Verify" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    rerender(<ListBank variant="rejected" />);
    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resubmit" })).toBeInTheDocument();
    rerender(<ListBank variant="verified" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders as a list item inside a List", () => {
    render(
      <List>
        <ListBank />
      </List>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
