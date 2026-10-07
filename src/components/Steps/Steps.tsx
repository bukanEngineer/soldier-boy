import React from "react";
import { cn } from "../../lib/cn";
import "./Steps.css";

export type HorizontalStepsProps = React.ComponentProps<"div"> & {
  /** Total steps (clamped 2–7) */
  total?: number;
  /** Current filled count (segments with index < current) */
  current?: number;
  /** Show "current/total label" under the track */
  showCount?: boolean;
  /** Label after the count */
  label?: string;
};

/**
 * Segmented progress bar for linear, user-driven flows (onboarding, KYC, quizzes).
 * Supports 2–7 steps.
 */
export function HorizontalSteps({
  total = 3,
  current = 1,
  showCount = true,
  label = "Steps",
  className,
  ...rest
}: HorizontalStepsProps) {
  const steps = Math.min(Math.max(total, 2), 7);
  return (
    <div className={cn("h-steps", className)} {...rest}>
      <div
        className="h-steps__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={steps}
        aria-valuenow={current}
        aria-valuetext={`${current} of ${steps} ${label}`}
      >
        {Array.from({ length: steps }).map((_, i) => (
          <span
            key={i}
            data-filled={i < current ? "" : undefined}
            className="h-steps__segment"
          />
        ))}
      </div>
      {showCount && (
        <span className="h-steps__count">
          {current}/{steps} {label}
        </span>
      )}
    </div>
  );
}

export type VerticalStepStatus = "completed" | "active" | "inactive" | "failed";

export type VerticalStepsProps = React.ComponentProps<"ol">;

/**
 * Read-only status timeline. Compose with `VerticalStep` children (newest-first).
 *
 *   <VerticalSteps>
 *     <VerticalStep status="completed" timestamp="…">Request Resolved</VerticalStep>
 *   </VerticalSteps>
 */
export function VerticalSteps({ className, ...rest }: VerticalStepsProps) {
  return <ol className={cn("v-steps", className)} {...rest} />;
}

export type VerticalStepProps = Omit<React.ComponentProps<"li">, "title"> & {
  status?: VerticalStepStatus;
  timestamp?: React.ReactNode;
  note?: React.ReactNode;
};

/**
 * Single timeline entry. Title comes from `children`.
 * Failed items without `note` get a default "Failed" note.
 * Connector coloring uses adjacent-sibling CSS from `data-status`.
 */
export function VerticalStep({
  status = "inactive",
  timestamp,
  note,
  children,
  className,
  ...rest
}: VerticalStepProps) {
  const resolvedNote = note ?? (status === "failed" ? "Failed" : undefined);

  return (
    <li data-status={status} className={cn("v-steps__item", className)} {...rest}>
      <span className="v-steps__line">
        <span data-edge="before" className="v-steps__connector" aria-hidden="true" />
        <span className="v-steps__dot" aria-hidden="true" />
        <span data-edge="after" className="v-steps__connector" aria-hidden="true" />
      </span>
      <span className="v-steps__content">
        <span className="v-steps__title">{children}</span>
        {timestamp != null && timestamp !== "" && (
          <span className="v-steps__timestamp">{timestamp}</span>
        )}
        {resolvedNote != null && <span className="v-steps__note">{resolvedNote}</span>}
      </span>
    </li>
  );
}

export type BadgeStepsProps = Omit<React.ComponentProps<"div">, "title"> & {
  step?: number | string;
  /** Prefer `<BadgeStepsTitle>` as a child */
  title?: React.ReactNode;
  /** Prefer `<BadgeStepsDescription>` as a child */
  description?: React.ReactNode;
};

export type BadgeStepsTitleProps = React.ComponentProps<"span">;

export function BadgeStepsTitle({ className, ...props }: BadgeStepsTitleProps) {
  return <span className={cn("badge-steps__title", className)} {...props} />;
}

export type BadgeStepsDescriptionProps = React.ComponentProps<"span">;

export function BadgeStepsDescription({
  className,
  ...props
}: BadgeStepsDescriptionProps) {
  return <span className={cn("badge-steps__description", className)} {...props} />;
}

/**
 * Compact step header for content inside a card.
 *
 *   <BadgeSteps step={1}>
 *     <BadgeStepsTitle>Select Transfer Method</BadgeStepsTitle>
 *     <BadgeStepsDescription>…</BadgeStepsDescription>
 *   </BadgeSteps>
 */
export function BadgeSteps({
  step = 1,
  title,
  description,
  className,
  children,
  ...rest
}: BadgeStepsProps) {
  return (
    <div className={cn("badge-steps", className)} {...rest}>
      <span className="badge-steps__counter" aria-hidden="true">
        {step}
      </span>
      <span className="badge-steps__content">
        {title != null && <BadgeStepsTitle>{title}</BadgeStepsTitle>}
        {description != null && (
          <BadgeStepsDescription>{description}</BadgeStepsDescription>
        )}
        {children}
      </span>
    </div>
  );
}
