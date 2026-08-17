/**
 * Shared test utilities for soldier-boy component tests.
 *
 * Provides helpers to verify usability (renders without crashing, className
 * forwarding, prop spreading) and scalability (large dataset rendering).
 */
import { render, screen } from "@testing-library/react";
import { expect } from "vitest";

/**
 * Renders a component with the given props and asserts it does not throw.
 * Returns the render result for further assertions.
 */
export function renderSmoke(Component, props = {}) {
  const result = render(<Component {...props} />);
  expect(result.container.firstChild).not.toBeNull();
  return result;
}

/**
 * Asserts that a component forwards the `className` prop to its root element.
 */
export function assertClassNameForwarding(Component, baseProps = {}) {
  const testClass = "test-custom-class";
  const { container } = render(
    <Component {...baseProps} className={testClass} />,
  );
  const root = container.firstChild;
  expect(root).toHaveClass(testClass);
}

/**
 * Asserts that a component forwards unknown HTML attributes (data-*, aria-*)
 * to its root element. This verifies prop spreading / rest-prop behavior.
 */
export function assertPropSpreading(Component, baseProps = {}) {
  const { container } = render(
    <Component {...baseProps} data-testid="spread-check" aria-label="spread" />,
  );
  const root = container.firstChild;
  expect(root).toHaveAttribute("data-testid", "spread-check");
}

/**
 * Generates an array of N items using a factory function.
 * Useful for scalability tests with large datasets.
 *
 * @param {number} count - Number of items to generate
 * @param {(index: number) => any} factory - Factory function that receives the index
 * @returns {Array} Array of generated items
 */
export function generateItems(count, factory) {
  return Array.from({ length: count }, (_, i) => factory(i));
}

/**
 * Measures the time it takes to render a component.
 * Returns { result, durationMs }.
 */
export function measureRender(Component, props = {}) {
  const start = performance.now();
  const result = render(<Component {...props} />);
  const durationMs = performance.now() - start;
  return { result, durationMs };
}

// Re-export testing-library for convenience
export { render, screen };
