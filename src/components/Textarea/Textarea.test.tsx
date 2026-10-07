import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";
import { Field } from "../Field/Field";

function Demo(props: React.ComponentProps<typeof Textarea> & { label?: string }) {
  const { label = "Notes", ...rest } = props;
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <Textarea {...rest} />
    </Field.Root>
  );
}

describe("Textarea", () => {
  it("wires the label through Field", () => {
    render(<Demo />);
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
  });

  it("fires onChange when typing", async () => {
    const onChange = vi.fn();
    render(<Demo onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Notes"), "hi");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows a character count", () => {
    render(<Demo defaultValue="abc" showCount maxLength={10} />);
    expect(screen.getByText("3/10")).toBeInTheDocument();
  });
});
