import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Upload } from "./Upload";
import { Field } from "../Field/Field";
import { renderSmoke } from "../../test-utils";

describe("Upload", () => {
  it("renders without crashing", () => {
    renderSmoke(Upload);
  });

  it("renders with common props without crashing", () => {
    const { container } = render(
      <Field.Root>
        <Field.Label>Upload file</Field.Label>
        <Upload accept=".pdf,.png" maxSize={5000000} disabled={false} />
      </Field.Root>,
    );
    expect(container.firstChild).not.toBeNull();
  });

  it("contains a file input element", () => {
    const { container } = render(<Upload />);
    const input = container.querySelector("input[type='file']");
    expect(input).toBeInTheDocument();
  });

  it("shows Field error state", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Proof of identity</Field.Label>
        <Upload />
        <Field.Error match>File too large</Field.Error>
      </Field.Root>,
    );
    expect(screen.getByText("File too large")).toBeInTheDocument();
  });
});
