import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "../Button/Button";
import { renderSmoke } from "../../test-utils";

describe("ButtonGroup", () => {
  it("renders without crashing", () => {
    renderSmoke(ButtonGroup, {
      children: <Button variant="secondary">A</Button>,
    });
  });

  it("exposes role=group and orientation", () => {
    render(
      <ButtonGroup orientation="vertical" data-testid="group">
        <Button variant="secondary">A</Button>
        <Button variant="secondary">B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("role", "group");
    expect(group).toHaveAttribute("data-orientation", "vertical");
    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
  });
});
