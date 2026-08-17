import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Upload } from "./Upload";
import { renderSmoke } from "../../test-utils";

describe("Upload", () => {
  // A: Renderability — basic smoke test for untyped component
  it("renders without crashing", () => {
    renderSmoke(Upload);
  });

  it("renders with common props without crashing", () => {
    const { container } = render(
      <Upload
        label="Upload file"
        accept=".pdf,.png"
        maxSize={5000000}
        disabled={false}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  // B: Accessibility — verify file input is present
  it("contains a file input element", () => {
    const { container } = render(<Upload />);
    const input = container.querySelector("input[type='file']");
    expect(input).toBeInTheDocument();
  });
});
