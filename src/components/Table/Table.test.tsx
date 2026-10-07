import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable as Table } from "./DataTable";
import { renderSmoke, generateItems } from "../../test-utils";

const columns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
];

const rows = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "User" },
  { id: "3", name: "Charlie", email: "charlie@example.com", role: "User" },
];

describe("Table", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Table);
  });

  it("renders with columns and rows", () => {
    render(<Table columns={columns} rows={rows} rowKey="id" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the wrapper", () => {
    const { container } = render(
      <Table columns={columns} rows={rows} rowKey="id" className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("applies zebra striping", () => {
    const { container } = render(
      <Table columns={columns} rows={rows} rowKey="id" zebra />,
    );
    expect(container.querySelector(".table--zebra")).toBeInTheDocument();
  });

  // C: Accessibility
  it("renders a table element", () => {
    render(<Table columns={columns} rows={rows} rowKey="id" />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<Table columns={columns} rows={rows} rowKey="id" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  // D: Sorting
  it("calls onSortChange when sortable column header clicked", async () => {
    const onSortChange = vi.fn();
    const sortableColumns = columns.map((c) => ({ ...c, sortable: true }));
    render(
      <Table
        columns={sortableColumns}
        rows={rows}
        rowKey="id"
        onSortChange={onSortChange}
      />,
    );
    await userEvent.click(screen.getByText("Name"));
    expect(onSortChange).toHaveBeenCalled();
  });

  // E: Empty state
  it("renders empty state when rows is empty", () => {
    render(
      <Table
        columns={columns}
        rows={[]}
        rowKey="id"
        empty={<p>No data available</p>}
      />,
    );
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  // F: Scalability — large datasets
  it("renders 1000 rows without crashing", () => {
    const manyRows = generateItems(1000, (i) => ({
      id: String(i),
      name: `User ${i}`,
      email: `user${i}@test.com`,
      role: i % 2 === 0 ? "Admin" : "User",
    }));
    const { container } = render(
      <Table columns={columns} rows={manyRows} rowKey="id" />,
    );
    expect(container.querySelectorAll("tbody tr").length).toBeGreaterThanOrEqual(
      1000,
    );
  });

  it("renders many columns without crashing", () => {
    const manyCols = generateItems(30, (i) => ({
      key: `col${i}`,
      header: `Column ${i}`,
    }));
    const rowsWithManyCols = generateItems(10, (i) => {
      const row = { id: String(i) };
      manyCols.forEach((c) => {
        row[c.key] = `val-${i}-${c.key}`;
      });
      return row;
    });
    render(<Table columns={manyCols} rows={rowsWithManyCols} rowKey="id" />);
    expect(screen.getByText("Column 0")).toBeInTheDocument();
    expect(screen.getByText("Column 29")).toBeInTheDocument();
  });
});
