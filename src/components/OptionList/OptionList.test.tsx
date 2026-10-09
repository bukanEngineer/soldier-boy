import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OptionList } from "./OptionList";
import { renderSmoke } from "../../test-utils";

const options = [
  { value: "dbs", name: "DBS Bank", secondary: "•••• 1234" },
  { value: "uob", name: "UOB", secondary: "•••• 9981", disabled: true },
];

describe("OptionList", () => {
  it("renders without crashing", () => {
    renderSmoke(OptionList);
  });

  it("renders options and marks the selected one", () => {
    const { container } = render(<OptionList options={options} value="dbs" />);
    expect(screen.getByText("DBS Bank")).toBeInTheDocument();
    expect(container.querySelector("[data-selected]")).toHaveTextContent("DBS Bank");
  });

  it("calls onValueChange when an enabled option is clicked", async () => {
    const onValueChange = vi.fn();
    render(<OptionList options={options} value="dbs" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText("UOB"));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText("DBS Bank"));
    expect(onValueChange).toHaveBeenCalledWith("dbs", expect.objectContaining({ value: "dbs" }));
  });
});

describe("OptionList keyboard selection", () => {
  const choices = [
    { value: "a", name: "Alpha" },
    { value: "b", name: "Beta", disabled: true },
    { value: "c", name: "Charlie" },
    { value: "d", name: "Delta" },
  ];

  it("has one tab stop, skips disabled options, and selects only on activation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<OptionList options={choices} value="a" onValueChange={onValueChange} />);
    await user.tab();
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveFocus();
    expect(screen.getAllByRole("option").filter((row) => row.tabIndex === 0)).toHaveLength(1);
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Charlie" })).toHaveFocus();
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("c", choices[2]);
    await user.keyboard("{ArrowUp} ");
    expect(onValueChange).toHaveBeenLastCalledWith("a", choices[0]);
  });

  it("supports Home, End, wrapping, and name typeahead without selecting", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<OptionList options={choices} onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{End}");
    expect(screen.getByRole("option", { name: "Delta" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("option", { name: "Delta" })).toHaveFocus();
    await user.keyboard("{Home}cha");
    expect(screen.getByRole("option", { name: "Charlie" })).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("restores focus when filtering removes an option, including an empty list", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<OptionList options={choices} />);
    await user.tab();
    await user.keyboard("{End}");
    rerender(<OptionList options={choices.slice(0, 3)} />);
    await waitFor(() => expect(screen.getByRole("option", { name: "Charlie" })).toHaveFocus());
    rerender(<OptionList options={[]} />);
    expect(screen.getByRole("listbox")).toHaveFocus();
    rerender(<OptionList options={choices} />);
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveFocus();
  });

  it("keeps focus in the search field when filtering from outside the list", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <input aria-label="Search" />
        <OptionList options={choices} />
      </>,
    );
    await user.click(screen.getByRole("textbox"));
    rerender(
      <>
        <input aria-label="Search" />
        <OptionList options={choices.slice(2)} />
      </>,
    );
    expect(screen.getByRole("textbox")).toHaveFocus();
  });
});
