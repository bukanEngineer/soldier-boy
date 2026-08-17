import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QR } from "./QR";
import { renderSmoke, assertClassNameForwarding } from "../../test-utils";

describe("QR", () => {
  // A: Renderability
  it("renders with required value prop", () => {
    renderSmoke(QR, { value: "https://example.com" });
  });

  it("renders with all optional props", () => {
    render(
      <QR
        value="https://straitsx.com/pay/123"
        size={300}
        label="Scan to pay"
        sub="Use your banking app"
      />,
    );
    expect(screen.getByText("Scan to pay")).toBeInTheDocument();
    expect(screen.getByText("Use your banking app")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    assertClassNameForwarding(QR, { value: "test" });
  });

  it("renders an image element for the QR code", () => {
    const { container } = render(<QR value="data" />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });

  // C: Custom urlBuilder
  it("uses custom urlBuilder for image source", () => {
    const urlBuilder = (value, size) =>
      `https://custom-api.com/qr?data=${value}&s=${size}`;
    const { container } = render(
      <QR value="hello" size={100} urlBuilder={urlBuilder} />,
    );
    const img = container.querySelector("img");
    expect(img.getAttribute("src")).toContain("custom-api.com");
    expect(img.getAttribute("src")).toContain("hello");
  });

  // D: Scalability — long values
  it("handles very long values without crashing", () => {
    const longValue = "https://example.com/" + "x".repeat(2000);
    const { container } = render(<QR value={longValue} />);
    expect(container.querySelector("img")).toBeInTheDocument();
  });
});
