import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Coachmark } from "./Coachmark";
import { Button } from "../Button/Button";

const meta: Meta<typeof Coachmark> = {
  title: "Components/Coachmark",
  component: Coachmark,
  parameters: { layout: "fullscreen" },
  argTypes: {
    title: { control: "text" },
    body: { control: "text" },
    open: { control: "boolean" },
  },
  args: {
    title: "Mint new stablecoins",
    body: "Convert SGD from your bank account into XSGD.",
    open: true,
  },
};
export default meta;

type Story = StoryObj<typeof Coachmark>;

export const Default: Story = {
  render: () => {
    const ref = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(true);
    return (
      <div style={{ padding: 64 }}>
        <Button ref={ref} onClick={() => setOpen(true)}>
          Mint
        </Button>
        <Coachmark
          target={ref}
          open={open}
          onDismiss={() => setOpen(false)}
          title="Mint new stablecoins"
          body="Convert SGD from your bank account into XSGD — instantly and at zero fee."
          step={1}
          totalSteps={3}
          onNext={() => setOpen(false)}
        />
      </div>
    );
  },
};

function PlacementDemo({ placement }: { placement: "top" | "bottom" | "left" | "right" }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <div
      style={{
        height: 480,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button ref={ref} onClick={() => setOpen(true)}>
        Target
      </Button>
      <Coachmark
        target={ref}
        open={open}
        onDismiss={() => setOpen(false)}
        placement={placement}
        title={`Beak ${placement}`}
        body={`This coachmark is placed to the ${placement} of its target, with a beak pointing back at it.`}
        step={1}
        totalSteps={3}
        onNext={() => setOpen(false)}
      />
    </div>
  );
}

export const Top: Story = { render: () => <PlacementDemo placement="top" /> };
export const Left: Story = { render: () => <PlacementDemo placement="left" /> };
export const Right: Story = { render: () => <PlacementDemo placement="right" /> };

export const WithDotsAndClose: Story = {
  render: () => {
    const ref = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(true);
    const [step, setStep] = useState(2);
    return (
      <div style={{ padding: 64 }}>
        <Button ref={ref} onClick={() => setOpen(true)}>
          Feature
        </Button>
        <Coachmark
          target={ref}
          open={open}
          onDismiss={() => setOpen(false)}
          title="Statements"
          body="Download monthly statements from your company profile."
          step={step}
          totalSteps={4}
          onPrev={() => setStep((s) => Math.max(1, s - 1))}
          onNext={() => setStep((s) => Math.min(4, s + 1))}
        />
      </div>
    );
  },
};
