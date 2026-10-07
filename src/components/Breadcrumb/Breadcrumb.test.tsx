import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbButton,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./Breadcrumb";
import { renderSmoke } from "../../test-utils";

function trail() {
  return (
    <Breadcrumb className="custom">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Widget</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  it("renders with no props", () => {
    renderSmoke(Breadcrumb);
  });

  it("renders composed items", () => {
    render(trail());
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Widget")).toBeInTheDocument();
  });

  it("forwards className", () => {
    const { container } = render(trail());
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("renders links with href", () => {
    render(trail());
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  });

  it("has nav role with aria-label", () => {
    render(trail());
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("marks current page with aria-current=page", () => {
    render(trail());
    expect(screen.getByText("Widget")).toHaveAttribute("aria-current", "page");
  });

  it("hides separators from assistive technology", () => {
    const { container } = render(trail());
    const separators = container.querySelectorAll("[aria-hidden='true']");
    expect(separators.length).toBeGreaterThan(0);
  });

  it("fires onClick on BreadcrumbButton", async () => {
    const onClick = vi.fn();
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbButton onClick={onClick}>Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    await userEvent.click(screen.getByText("Home"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders many levels without crashing", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          {Array.from({ length: 20 }, (_, i) => (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                {i < 19 ? (
                  <BreadcrumbLink href={`/level-${i}`}>Level {i}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>Level {i}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {i < 19 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByText("Level 0")).toBeInTheDocument();
    expect(screen.getByText("Level 19")).toBeInTheDocument();
  });
});
