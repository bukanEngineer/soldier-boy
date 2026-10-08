// End-to-end packaging smoke test: builds the package, packs the *actual*
// npm tarball (respecting package.json "files"/"exports", exactly what a
// consumer would download from the registry), installs it into a throwaway
// consumer project, bundles a small fixture with esbuild (a real bundler —
// this is what previously broke: `new URL(\`...${slug}.svg\`, import.meta.url)`
// silently produced dead <img> tags under Webpack/Next.js and was fragile
// even under Vite), and asserts the rendered HTML contains real inline
// <svg> markup for partner/network/stablecoin logos rather than a broken
// <img src="file://...">.
import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
// Keep the scratch dir inside the workspace (not os.tmpdir()) so this works
// under sandboxed/CI environments that restrict writes outside the repo.
const SCRATCH = path.join(ROOT, ".smoke-test-tmp");

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
    ...opts,
  });
}

function fail(message) {
  console.error(`\n✗ smoke test failed: ${message}\n`);
  process.exitCode = 1;
  throw new Error(message);
}

async function main() {
  await rm(SCRATCH, { recursive: true, force: true });
  await mkdir(SCRATCH, { recursive: true });

  console.log("→ Building package (npm run build)...");
  run("npm", ["run", "build"], { cwd: ROOT });

  console.log("→ Packing the real npm tarball (npm pack)...");
  const packOut = run("npm", ["pack", "--pack-destination", SCRATCH], { cwd: ROOT });
  const tarballName = packOut.trim().split("\n").pop().trim();
  const tarballPath = path.join(SCRATCH, tarballName);
  console.log(`  packed ${tarballName}`);

  const consumerDir = path.join(SCRATCH, "consumer");
  await mkdir(consumerDir, { recursive: true });
  await writeFile(
    path.join(consumerDir, "package.json"),
    JSON.stringify(
      {
        name: "smoke-test-consumer",
        private: true,
        type: "module",
        dependencies: {
          "stxdesign-sandbox": `file:${tarballPath}`,
          react: "^19.0.0",
          "react-dom": "^19.0.0",
        },
      },
      null,
      2,
    ),
  );

  console.log("→ Installing the tarball into a throwaway consumer project (npm install)...");
  run("npm", ["install", "--no-audit", "--no-fund", "--silent"], { cwd: consumerDir });

  const fixture = `
import { renderToStaticMarkup } from "react-dom/server";
import { Logo, PartnerLogo, AssetMark, Icon } from "stxdesign-sandbox";
import { CloseIcon } from "stxdesign-sandbox/icons";
import { RocketIllustration } from "stxdesign-sandbox/illustrations";
import { DbsLogo, ZilliqaLogo } from "stxdesign-sandbox/logos";

const html = renderToStaticMarkup(
  <div>
    <Logo size={100} />
    <PartnerLogo name="xsgd" size={32} />
    <PartnerLogo name="dbs" logo={DbsLogo} size={40} />
    <PartnerLogo name="zilliqa" logo={ZilliqaLogo} size={32} />
    <PartnerLogo name="some-unregistered-partner" size={32} />
    <AssetMark asset="ETH" size={40} />
    <Icon name="close" />
    <CloseIcon />
    <RocketIllustration />
  </div>
);
process.stdout.write(html);
`;
  await writeFile(path.join(consumerDir, "fixture.jsx"), fixture);

  console.log("→ Bundling the fixture with esbuild (real bundler, like a consumer app)...");
  run(
    "npx",
    [
      "esbuild",
      "fixture.jsx",
      "--bundle",
      "--platform=node",
      // CJS output so Node's native `require()` handles builtins (util,
      // etc.) that react-dom/server pulls in — esbuild's ESM-output
      // require-shim only supports statically bundled modules.
      "--format=cjs",
      "--jsx=automatic",
      "--outfile=bundle.cjs",
    ],
    { cwd: consumerDir },
  );

  console.log("→ Executing the bundled output with node...");
  const html = run("node", ["bundle.cjs"], { cwd: consumerDir });

  const svgCount = (html.match(/<svg/g) || []).length;
  if (svgCount < 8) {
    fail(
      `expected at least 8 <svg> elements (Logo + 3 PartnerLogo + AssetMark + 2 icons + illustration), got ${svgCount}.\n${html}`,
    );
  }
  if (html.includes("<img")) {
    fail(
      `found an <img> tag in the rendered output — logos should be inlined as <svg>, not loaded via <img>.\n${html}`,
    );
  }
  if (html.includes("file://") || html.includes("undefined.svg")) {
    fail(`found a broken file:// or unresolved asset URL in the rendered output.\n${html}`);
  }
  if (!html.includes("Some Unregistered Partner")) {
    fail(`expected the unregistered-partner fallback pill to render.\n${html}`);
  }

  // Bundle-size budgets. One <AssetMark> used to pull in all 50 logos (~490 KB
  // minified) because they sat in a single lookup table; they must stay
  // individually tree-shakeable. Measured at ~31 KB / ~2.5 KB when set.
  const budgets = [
    {
      name: "AssetMark from the package root",
      source: 'import { AssetMark } from "stxdesign-sandbox"; console.log(AssetMark);',
      maxBytes: 60_000,
    },
    {
      // The whole icon set (about 90 icons) sits behind <Icon name>; measured at ~65 KB.
      name: "Icon from the package root",
      source: 'import { Icon } from "stxdesign-sandbox"; console.log(Icon);',
      maxBytes: 90_000,
    },
    {
      name: "one icon from stxdesign-sandbox/icons",
      source: 'import { CloseIcon } from "stxdesign-sandbox/icons"; console.log(CloseIcon);',
      maxBytes: 5_000,
    },
    {
      name: "one illustration from stxdesign-sandbox/illustrations",
      source:
        'import { RocketIllustration } from "stxdesign-sandbox/illustrations"; console.log(RocketIllustration);',
      maxBytes: 15_000,
    },
    {
      name: "one logo from stxdesign-sandbox/logos",
      source: 'import { DbsLogo } from "stxdesign-sandbox/logos"; console.log(DbsLogo);',
      maxBytes: 10_000,
    },
  ];
  for (const [i, budget] of budgets.entries()) {
    await writeFile(path.join(consumerDir, `size-${i}.jsx`), budget.source);
    run(
      "npx",
      [
        "esbuild",
        `size-${i}.jsx`,
        "--bundle",
        "--minify",
        "--format=esm",
        "--jsx=automatic",
        "--loader:.css=empty",
        "--external:react",
        "--external:react-dom",
        "--external:react/jsx-runtime",
        "--external:@base-ui/react",
        "--external:@base-ui/react/*",
        "--external:core-js",
        "--external:core-js/*",
        `--outfile=size-${i}.js`,
      ],
      { cwd: consumerDir },
    );
    const bytes = Buffer.byteLength(await readFile(path.join(consumerDir, `size-${i}.js`)));
    console.log(`  ${budget.name}: ${bytes} bytes minified (budget ${budget.maxBytes})`);
    if (bytes > budget.maxBytes) {
      fail(`${budget.name} bundles to ${bytes} bytes, over the ${budget.maxBytes} byte budget.`);
    }
  }

  console.log(
    `\n✓ Packed tarball renders ${svgCount} inline <svg> elements, no <img>/file:// URLs, under a real bundler (esbuild).`,
  );
}

try {
  await main();
} finally {
  await rm(SCRATCH, { recursive: true, force: true });
}
