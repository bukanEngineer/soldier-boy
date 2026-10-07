import "../src/styles/global.css";

/** @type { import('@storybook/react').Preview } */
const preview = {
  tags: ["autodocs"],

  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: { width: "360px", height: "800px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1280px", height: "900px" },
        },
      },
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    backgrounds: {
      options: {
        surface: { name: "surface", value: "#FFFFFF" },
        subtle: { name: "subtle", value: "#F7F7F7" },
        muted: { name: "muted", value: "#F6F7F9" },
        dashboard: { name: "dashboard", value: "#F1F2F4" },
        ivy: { name: "ivy", value: "#002B2A" },
        teal: { name: "teal", value: "#054948" }
      }
    },

    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Foundations",
          ["Colors", "Typography", "Spacing & Elevation"],
          "Atoms",
          "P1 Components",
          "Components",
          "Patterns",
          "Examples",
          "*",
        ],
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "error",
      // Base UI focus guards are aria-hidden + tabindex by design; axe flags them
      // as aria-hidden-focus false positives.
      context: {
        exclude: ["[data-base-ui-focus-guard]"],
      },
    }
  },

  initialGlobals: {
    backgrounds: {
      value: "surface"
    }
  }
};

export default preview;
