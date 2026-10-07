import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardDetailRow,
} from "./Card";
import {
  renderSmoke,
  assertClassNameForwarding,
  assertPropSpreading,
} from "../../test-utils";

describe("Card", () => {
  it("renders with no props", () => {
    renderSmoke(Card);
  });

  it("forwards className", () => {
    assertClassNameForwarding(Card);
  });

  it("spreads HTML attributes onto the section element", () => {
    assertPropSpreading(Card);
  });

  it("renders as a section element", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveProperty("tagName", "SECTION");
  });

  it("applies shadow via data-shadow", () => {
    const { container } = render(<Card shadow={3}>Content</Card>);
    expect(container.firstChild).toHaveAttribute("data-shadow", "3");
  });

  it("does not set data-shadow when shadow is false", () => {
    const { container } = render(<Card shadow={false}>Content</Card>);
    expect(container.firstChild).not.toHaveAttribute("data-shadow");
  });

  it("composes header, content and footer parts", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>
          <button type="button">Action</button>
        </CardFooter>
      </Card>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("renders nested cards without crashing", () => {
    const { container } = render(
      <Card>
        {Array.from({ length: 20 }, (_, i) => (
          <Card key={i}>
            <CardTitle>Nested {i}</CardTitle>
          </Card>
        ))}
      </Card>,
    );
    expect(container.querySelectorAll("section")).toHaveLength(21);
  });
});

describe("CardDetailRow", () => {
  it("puts the info icon on the label by default", () => {
    const { container } = render(
      <dl>
        <CardDetailRow label="Fee" value="0.50 SGD" info />
      </dl>,
    );
    const label = container.querySelector(".card-detail-row__label");
    const value = container.querySelector(".card-detail-row__value");
    expect(label?.querySelector(".card-detail-row__info")).not.toBeNull();
    expect(value?.querySelector(".card-detail-row__info")).toBeNull();
    expect(container.querySelector(".card-detail-row")).toHaveAttribute(
      "data-info-placement",
      "label",
    );
  });

  it("can put the info icon on the value", () => {
    const { container } = render(
      <dl>
        <CardDetailRow label="Fee" value="0.50 SGD" info infoPlacement="value" infoSize={18} />
      </dl>,
    );
    const label = container.querySelector(".card-detail-row__label");
    const value = container.querySelector(".card-detail-row__value");
    expect(label?.querySelector(".card-detail-row__info")).toBeNull();
    expect(value?.querySelector(".card-detail-row__info")).not.toBeNull();
    expect(container.querySelector(".card-detail-row")).toHaveAttribute(
      "data-info-placement",
      "value",
    );
  });
});
