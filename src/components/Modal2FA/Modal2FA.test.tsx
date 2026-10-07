import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal2FA } from "./Modal2FA";

function Controlled(props: Partial<React.ComponentProps<typeof Modal2FA>>) {
  const [code, setCode] = React.useState("");
  return <Modal2FA defaultOpen value={code} onValueChange={setCode} {...props} />;
}

describe("Modal2FA", () => {
  it("renders a labelled dialog with a digit group", async () => {
    render(<Controlled />);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("2-Factor Authentication");
    expect(screen.getByRole("group", { name: "Authentication code" })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });

  it("advances focus as digits are typed and enables Verify when complete", async () => {
    const onVerify = vi.fn();
    render(<Controlled onVerify={onVerify} />);
    await screen.findByRole("dialog");
    const verify = screen.getByRole("button", { name: "Verify" });
    expect(verify).toBeDisabled();
    await userEvent.click(screen.getByLabelText("Digit 1"));
    await userEvent.keyboard("123456");
    expect(screen.getByLabelText("Digit 6")).toHaveValue("6");
    expect(verify).toBeEnabled();
    await userEvent.click(verify);
    expect(onVerify).toHaveBeenCalledTimes(1);
  });

  it("Backspace on an empty digit moves focus back", async () => {
    render(<Controlled />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByLabelText("Digit 1"));
    await userEvent.keyboard("1");
    expect(screen.getByLabelText("Digit 2")).toHaveFocus();
    await userEvent.keyboard("{Backspace}");
    expect(screen.getByLabelText("Digit 1")).toHaveFocus();
  });

  it("Cancel closes through onOpenChange", async () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("merges className onto the modal panel", async () => {
    render(<Controlled className="extra" />);
    expect(await screen.findByRole("dialog")).toHaveClass("modal", "tfa", "extra");
  });
});
