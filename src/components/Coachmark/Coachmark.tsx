import React, { useLayoutEffect, useState } from "react";
import { Popover } from "../Popover/Popover";
import { Button } from "../Button/Button";
import { cn } from "../../lib/cn";
import "./Coachmark.css";
import { Icon } from "../Icon/Icon";

export type CoachmarkProps = {
  /** Ref to the element to highlight and anchor against. */
  target?: React.RefObject<HTMLElement | null>;
  open?: boolean;
  onDismiss?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  title?: React.ReactNode;
  body?: React.ReactNode;
  step?: number;
  totalSteps?: number;
  nextLabel?: string;
  doneLabel?: string;
  prevLabel?: string;
  /** Popover side relative to the target. */
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
};

/**
 * Product tour callout built on `Popover`, with a spotlight hole over `target`.
 *
 *   <Coachmark
 *     target={ref}
 *     open={open}
 *     onDismiss={() => setOpen(false)}
 *     title="Mint"
 *     body="Convert SGD into XSGD."
 *     step={1}
 *     totalSteps={3}
 *     onNext={goNext}
 *   />
 */
export function Coachmark({
  target,
  open = true,
  onDismiss,
  onNext,
  onPrev,
  title,
  body,
  step,
  totalSteps,
  nextLabel = "Next",
  doneLabel = "Got it",
  prevLabel = "Back",
  placement = "bottom",
  className = "",
}: CoachmarkProps) {
  const anchor = open ? (target?.current ?? null) : null;
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (!anchor) return undefined;
    const measure = () => setRect(anchor.getBoundingClientRect());
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [anchor]);

  const isLast = totalSteps != null && step != null && step >= totalSteps;
  const pad = 6;
  const showSpot = open && rect != null;
  const spotStyle = showSpot
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : undefined;

  return (
    <>
      {showSpot && (
        <>
          <button
            type="button"
            className="coachmark-scrim"
            aria-label="Dismiss"
            onClick={onDismiss}
          />
          <div className="coachmark-spot" style={spotStyle} aria-hidden="true" />
        </>
      )}
      <Popover.Root
        open={open && !!anchor}
        onOpenChange={(next) => {
          if (!next) onDismiss?.();
        }}
        modal={false}
      >
        <Popover.Popup
          side={placement}
          sideOffset={12}
          align="start"
          anchor={anchor}
          className={cn("coachmark", className)}
          positionerProps={{ className: "coachmark__positioner" }}
        >
          {(title || onDismiss) && (
            <div className="coachmark__head">
              {title && <Popover.Title className="coachmark__title">{title}</Popover.Title>}
              {onDismiss && (
                <Popover.Close className="coachmark__close" aria-label="Dismiss">
                  <Icon name="close_small" />
                </Popover.Close>
              )}
            </div>
          )}
          {body && <Popover.Description className="coachmark__body">{body}</Popover.Description>}
          <div className="coachmark__foot">
            {step != null && totalSteps != null ? (
              <div
                className="coachmark__dots"
                role="tablist"
                aria-label={`Step ${step} of ${totalSteps}`}
              >
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    className="coachmark__dot"
                    data-active={i + 1 === step || undefined}
                    aria-current={i + 1 === step ? "step" : undefined}
                  />
                ))}
              </div>
            ) : (
              <span />
            )}
            <div className="coachmark__actions">
              {onPrev && step != null && step > 1 && (
                <Button variant="tertiary" size="sm" onClick={onPrev}>
                  {prevLabel}
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={isLast ? onDismiss : onNext || onDismiss}
              >
                {isLast ? doneLabel : nextLabel}
              </Button>
            </div>
          </div>
        </Popover.Popup>
      </Popover.Root>
    </>
  );
}
