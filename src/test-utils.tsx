/**
 * Shared test utilities for stxdesign-sandbox component tests.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { expect } from "vitest";

/** Renders a component with the given props and asserts it does not throw. */
export function renderSmoke<P extends object>(
  Component: React.ComponentType<P>,
  props: P = {} as P,
) {
  const result = render(React.createElement(Component, props));
  expect(result.container.firstChild).not.toBeNull();
  return result;
}

/** Asserts that a component forwards the `className` prop to its root element. */
export function assertClassNameForwarding<P extends { className?: string }>(
  Component: React.ComponentType<P>,
  baseProps: P = {} as P,
) {
  const testClass = "test-custom-class";
  const { container } = render(
    React.createElement(Component, { ...baseProps, className: testClass }),
  );
  expect(container.firstChild as Element).toHaveClass(testClass);
}

/** Asserts that a component forwards unknown HTML attributes to its root. */
export function assertPropSpreading<P extends object>(
  Component: React.ComponentType<P>,
  baseProps: P = {} as P,
) {
  const { container } = render(
    React.createElement(Component, {
      ...baseProps,
      "data-testid": "spread-check",
      "aria-label": "spread",
    } as P),
  );
  expect(container.firstChild as Element).toHaveAttribute("data-testid", "spread-check");
}

/** Generates an array of N items using a factory function. */
export function generateItems<T>(count: number, factory: (index: number) => T): T[] {
  return Array.from({ length: count }, (_, i) => factory(i));
}

/** Measures the time it takes to render a component. */
export function measureRender<P extends object>(
  Component: React.ComponentType<P>,
  props: P = {} as P,
) {
  const start = performance.now();
  const result = render(React.createElement(Component, props));
  const durationMs = performance.now() - start;
  return { result, durationMs };
}

export { render, screen };
