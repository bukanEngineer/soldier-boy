import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field } from "./Field";

describe("Field", () => {
  it("labels the control and links the description", () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control />
        <Field.Description>We never share it.</Field.Description>
      </Field.Root>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAccessibleDescription("We never share it.");
  });

  it("shows a forced error and marks the control invalid", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control />
        <Field.Description>Helper</Field.Description>
        <Field.Error match>Email is taken</Field.Error>
      </Field.Root>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid");
    expect(screen.getByText("Email is taken")).toHaveClass("field__error");
  });

  it("merges className on parts", () => {
    render(
      <Field.Root className="custom" data-testid="root">
        <Field.Control aria-label="x" />
      </Field.Root>,
    );
    expect(screen.getByTestId("root")).toHaveClass("field", "custom");
  });
});
