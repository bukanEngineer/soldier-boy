import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "../Button/Button";
import { renderSmoke } from "../../test-utils";

describe("ButtonGroup", () => {
  it("renders without crashing", () => {
    renderSmoke(ButtonGroup, {
      children: [
        <Button key="a" variant="secondary">A</Button>,
        <Button key="b" variant="primary">B</Button>,
      ],
    });
  });

  it("exposes role=group", () => {
    render(
      <ButtonGroup data-testid="group">
        <Button variant="secondary">A</Button>
        <Button variant="primary">B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("role", "group");
    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
  });

  it("puts the more prominent button on the right regardless of child order", () => {
    const names = (el: HTMLElement) =>
      Array.from(el.querySelectorAll("button")).map((b) => b.textContent);

    const { rerender } = render(
      <ButtonGroup data-testid="group">
        <Button variant="primary">P</Button>
        <Button variant="secondary">S</Button>
      </ButtonGroup>,
    );
    expect(names(screen.getByTestId("group"))).toEqual(["S", "P"]);

    rerender(
      <ButtonGroup data-testid="group">
        <Button variant="secondary">S</Button>
        <Button variant="tertiary">T</Button>
      </ButtonGroup>,
    );
    expect(names(screen.getByTestId("group"))).toEqual(["T", "S"]);
  });
});
