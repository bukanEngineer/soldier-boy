import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorResponse } from "./ErrorResponse";
import { renderSmoke, assertClassNameForwarding } from "../../test-utils";

describe("ErrorResponse", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(ErrorResponse);
  });

  it("renders with all optional props", () => {
    render(
      <ErrorResponse
        code="404"
        title="Page Not Found"
        body="The page you are looking for does not exist."
        actions={<button>Go Home</button>}
      />,
    );
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText("The page you are looking for does not exist."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go Home" })).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    assertClassNameForwarding(ErrorResponse);
  });

  // C: Composability — actions slot
  it("accepts complex actions", () => {
    render(
      <ErrorResponse
        code="500"
        title="Server Error"
        actions={
          <div>
            <button>Retry</button>
            <button>Contact Support</button>
          </div>
        }
      />,
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Contact Support" }),
    ).toBeInTheDocument();
  });
});
