import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Table,
  TableWrap,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";

describe("Table (compound)", () => {
  it("renders semantic table parts", () => {
    render(
      <TableWrap>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Alice</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableWrap>,
    );
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Alice" })).toBeInTheDocument();
  });

  it("applies zebra via data attribute", () => {
    const { container } = render(<Table zebra />);
    expect(container.querySelector("table")).toHaveAttribute("data-zebra", "true");
    expect(container.querySelector("table")).toHaveClass("table--zebra");
  });
});
