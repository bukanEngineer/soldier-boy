import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomSheetBank } from "../BottomSheetBank";
import { BottomSheetBlockchain } from "../BottomSheetBlockchain";
import { BottomSheetNetwork } from "../BottomSheetNetwork";
import { BottomSheetSelect } from "./BottomSheetSelect";

const items = [
  { id: "dbs", name: "DBS Bank", description: "•••• 1234" },
  { id: "uob", name: "UOB" },
];

describe("BottomSheetSelect recipes", () => {
  it("BottomSheetBank renders a default title, rows and the selected state", async () => {
    render(<BottomSheetBank defaultOpen banks={items} value="dbs" />);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Select Bank");
    expect(screen.getByRole("listbox", { name: "Select Bank" })).toBeInTheDocument();
    const dbs = screen.getByRole("option", { name: /DBS Bank/ });
    expect(dbs).toHaveAttribute("aria-selected", "true");
    expect(dbs).toHaveAttribute("data-selected");
    const uob = screen.getByRole("option", { name: /UOB/ });
    expect(uob).toHaveAttribute("aria-selected", "false");
    expect(uob).not.toHaveAttribute("data-selected");
    // Fallback mark is the initials of the name.
    expect(uob.querySelector(".option-list__initials")).toHaveTextContent("UO");
  });

  it("calls onValueChange with the id and item", async () => {
    const onValueChange = vi.fn();
    render(<BottomSheetNetwork defaultOpen networks={items} onValueChange={onValueChange} />);
    await screen.findByRole("dialog");
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Select Network");
    await userEvent.click(screen.getByRole("option", { name: /UOB/ }));
    expect(onValueChange).toHaveBeenCalledWith("uob", items[1]);
  });

  it("BottomSheetBlockchain merges className and supports a custom title", async () => {
    render(
      <BottomSheetBlockchain defaultOpen chains={items} title="Pick chain" className="extra" />,
    );
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Pick chain");
    expect(dialog).toHaveClass("bsheet", "bsheet-select", "bsc", "extra");
  });

  it("closes via the header close button with onOpenChange", async () => {
    const onOpenChange = vi.fn();
    render(<BottomSheetBank open banks={items} onOpenChange={onOpenChange} />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  describe("BottomSheetSelect searchable", () => {
    const assets = [
      { id: "xsgd", name: "XSGD", description: "Singapore dollar" },
      { id: "xusd", name: "XUSD", description: "US dollar" },
      { id: "eth", name: "Ether", description: "Ethereum" },
    ];

    it("filters by name and description and shows an empty state", async () => {
      render(<BottomSheetSelect defaultOpen title="Asset" items={assets} searchable />);
      await screen.findByRole("dialog");
      const search = screen.getByRole("searchbox", { name: "Search" });
      await userEvent.type(search, "dollar");
      expect(screen.getAllByRole("option")).toHaveLength(2);
      await userEvent.clear(search);
      await userEvent.type(search, "zzz");
      expect(screen.queryByRole("option")).not.toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent("No results found");
    });

    it("clears the query when the sheet is reopened", async () => {
      function Parent() {
        const [open, setOpen] = React.useState(true);
        return (
          <>
            <button onClick={() => setOpen(true)}>Reopen</button>
            <BottomSheetSelect open={open} onOpenChange={setOpen} title="Asset" items={assets} searchable />
          </>
        );
      }
      render(<Parent />);
      await screen.findByRole("dialog");
      await userEvent.type(screen.getByRole("searchbox"), "eth");
      await userEvent.click(screen.getByRole("button", { name: "Close" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      await userEvent.click(screen.getByRole("button", { name: "Reopen" }));
      expect(await screen.findByRole("searchbox")).toHaveValue("");
    });

    it("keeps the query while the parent re-renders", async () => {
      function Parent() {
        const [value, setValue] = React.useState<string | null>(null);
        return (
          <BottomSheetSelect
            defaultOpen
            title="Asset"
            items={assets}
            value={value}
            onValueChange={setValue}
            searchable
          />
        );
      }
      render(<Parent />);
      await screen.findByRole("dialog");
      await userEvent.type(screen.getByRole("searchbox"), "eth");
      await userEvent.click(screen.getByRole("option", { name: /Ether/ }));
      expect(screen.getByRole("searchbox")).toHaveValue("eth");
      expect(screen.getByRole("option", { name: /Ether/ })).toHaveAttribute("aria-selected", "true");
    });

    it("does not render a search field by default", async () => {
      render(<BottomSheetSelect defaultOpen title="Asset" items={assets} />);
      await screen.findByRole("dialog");
      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });

    it("skips disabled items", async () => {
      const onValueChange = vi.fn();
      render(
        <BottomSheetSelect
          defaultOpen
          title="Asset"
          items={[{ id: "a", name: "Alpha", disabled: true }, { id: "b", name: "Beta" }]}
          onValueChange={onValueChange}
        />,
      );
      await screen.findByRole("dialog");
      await userEvent.click(screen.getByRole("option", { name: /Alpha/ }));
      expect(onValueChange).not.toHaveBeenCalled();
      await waitFor(() => expect(screen.getByRole("option", { name: /Beta/ })).toBeEnabled());
    });
  });
});
