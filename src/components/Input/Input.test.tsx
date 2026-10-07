import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";
import { Field } from "../Field/Field";

function Demo(props: React.ComponentProps<typeof Input> & { label?: string; error?: string }) {
  const { label = "Email", error, ...inputProps } = props;
  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      <Input {...inputProps} />
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

describe("Input", () => {
  it("wires the label to the control through Field", () => {
    render(<Demo placeholder="hello@straitsx.com" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("fires onChange when typing", async () => {
    const onChange = vi.fn();
    render(<Demo onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Email"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("clears via the clear button", async () => {
    render(<Demo defaultValue="hello" />);
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByLabelText("Email")).toHaveValue("");
  });

  it("toggles password visibility", async () => {
    render(<Demo label="Password" type="password" defaultValue="secret" />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
  });

  it("does not accept input when disabled", async () => {
    render(<Demo disabled defaultValue="locked" />);
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("is controlled via value + onChange", async () => {
    function Controlled() {
      const [value, setValue] = useState("");
      return <Demo value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    await userEvent.type(screen.getByLabelText("Email"), "hi");
    expect(screen.getByLabelText("Email")).toHaveValue("hi");
  });

  it("shows a server error from Field", () => {
    render(<Demo error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
