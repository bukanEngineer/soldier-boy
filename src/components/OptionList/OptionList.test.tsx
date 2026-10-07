import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
    expect(container.querySelector('[data-selected]')).toHaveTextContent("DBS Bank");
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
