// Vite (dev/Storybook/Vitest) also loads this file via the react plugin's
// `configFile: true` option. Polyfill injection (`useBuiltIns: "usage"`) is
// scoped to the production build: applying it during dev/test makes Vite's
// dependency optimizer discover new core-js modules mid-run and reload,
// which breaks in-flight Storybook/Vitest browser tests.
export default (api) => {
  const isProductionBuild = api.env("production");
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: "> 0.5%, last 2 versions, not dead",
          modules: false,
          ...(isProductionBuild ? { useBuiltIns: "usage", corejs: 3 } : {}),
        },
      ],
      ["@babel/preset-react", { runtime: "automatic" }],
      ["@babel/preset-typescript"],
    ],
  };
};
