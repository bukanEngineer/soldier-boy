import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { List, ListItem } from "./List";
import { renderSmoke, assertClassNameForwarding, assertPropSpreading } from "../../test-utils";

describe("List", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(List);
  });

  it("renders a semantic list of items", () => {
    render(
      <List>
        <ListItem title="One" />
        <ListItem title="Two" />
      </List>,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("marks divided lists", () => {
    render(<List divided data-testid="l" />);
    expect(screen.getByTestId("l")).toHaveAttribute("data-divided");
  });

  it("forwards className and props", () => {
    assertClassNameForwarding(List);
    assertPropSpreading(List);
  });
});

describe("ListItem", () => {
  it("renders a div (not an li) outside a List", () => {
    const { container } = render(<ListItem title="Solo" />);
    expect(container.firstChild?.nodeName).toBe("DIV");
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  it("renders all slots", () => {
    render(
      <ListItem
        leading={<i data-testid="lead" />}
        title="Title"
        description="Description"
        trailing={<b data-testid="trail" />}
      >
        <span data-testid="extra" />
      </ListItem>,
    );
    expect(screen.getByTestId("lead")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByTestId("extra")).toBeInTheDocument();
    expect(screen.getByTestId("trail")).toBeInTheDocument();
  });

  it("omits empty slots", () => {
    const { container } = render(<ListItem title="Only title" />);
    expect(container.querySelector(".list-item__leading")).toBeNull();
    expect(container.querySelector(".list-item__description")).toBeNull();
    expect(container.querySelector(".list-item__trailing")).toBeNull();
  });

  it("forwards className and props", () => {
    assertClassNameForwarding(ListItem);
    assertPropSpreading(ListItem);
  });
});
