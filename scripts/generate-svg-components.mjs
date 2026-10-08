// Generates one React component per SVG (logos, icons, illustrations): the
// artwork is optimized with SVGO and inlined as JSX with SVGR, instead of being
// shipped as a standalone file resolved via `new URL(..., import.meta.url)`.
//
// Why: a dynamic `new URL(\`./assets/${slug}.svg\`, import.meta.url)` cannot be
// statically analyzed by most bundlers (Vite handles literal paths only;
// Webpack/Next.js don't copy the asset at all), so consumers on Webpack/Next.js
// would get a broken <img>. Inlining the SVG as a real JSX component removes the
// asset-resolution step: it works identically in every bundler, and each
// component is a separate named export so unused ones are tree-shaken.
//
// Inputs live in src/assets/<kind>/*.svg (source of truth, git-tracked, NOT
// shipped in dist/). Outputs are generated into the component folders below and
// are git-ignored, regenerated before build/test/storybook (see the "pre*"
// scripts in package.json) and on demand via `npm run generate:assets`.
import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { transform } from "@svgr/core";

const ROOT = path.resolve(import.meta.dirname, "..");

/** snake_case or kebab-case slug -> PascalCase + suffix (arrow_forward -> ArrowForwardIcon) */
function toComponentName(slug, suffix) {
  const pascal = slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
  return `${pascal}${suffix}`;
}

const svgoBase = { name: "preset-default", params: { overrides: { removeViewBox: false } } };

// Gradient / filter / clip ids must be unique per component: SVGO shortens ids
// to `a`, `b`, ..., so two inline SVGs on one page would otherwise share ids
// and one would paint with the other's gradient. Prefix them with the file slug.
const svgoUniqueIds = (slug) => [
  svgoBase,
  { name: "prefixIds", params: { prefix: slug } },
  // Figma's "background blur" exports as <foreignObject><div xmlns="...xhtml" style="backdrop-filter">.
  // React puts HTML children of foreignObject in the right namespace itself, and
  // `xmlns` on a <div> is not a valid React prop.
  { name: "removeAttrs", params: { attrs: ["div:xmlns"] } },
];

const TARGETS = [
  {
    kind: "logos",
    srcDir: "src/assets/partners",
    outDir: "src/components/PartnerLogo/logos",
    suffix: "Logo",
    // Strip width/height so the wrapper (PartnerLogo.tsx) controls the rendered
    // size; viewBox is preserved so scaling stays correct.
    svgr: { dimensions: false },
    svgoPlugins: [svgoBase],
    // A PNG pasted into Figma exports as <image href="data:image/png;base64,...">:
    // not vector, blurry when scaled, often 100s of KB. Fail loudly instead.
    rejectRaster: true,
    barrel({ entries }) {
      // Named re-exports only (no lookup table): a table that references every
      // logo defeats tree-shaking, and one <AssetMark> would drag in all of them.
      return {
        "index.ts":
          header() +
          `import type { ComponentType, SVGProps } from "react";\n\n` +
          `export type PartnerLogoSvg = ComponentType<SVGProps<SVGSVGElement>>;\n\n` +
          entries.map(namedExport).join("\n") +
          `\n`,
      };
    },
  },
  {
    kind: "icons",
    srcDir: "src/assets/icons",
    outDir: "src/components/Icon/icons",
    suffix: "Icon",
    // Material Symbols are single-path, no fill: paint them with the text colour.
    svgr: { dimensions: false, svgProps: { fill: "currentColor" } },
    // The icons live on a 960-unit grid and are shown at ~24px, so one decimal
    // (0.0003px) is far finer than anything visible; SVGO's default of 3 only
    // adds bytes.
    svgoPlugins: [
      {
        name: "preset-default",
        params: { overrides: { removeViewBox: false, convertPathData: { floatPrecision: 1 } } },
      },
    ],
    barrel({ entries }) {
      const lookup = entries.map((e) => `  ${e.slug}: ${e.componentName},`).join("\n");
      return {
        // Named exports: `import { CloseIcon } from "stxdesign-sandbox/icons"`.
        "index.ts": header() + entries.map(namedExport).join("\n") + `\n`,
        // Lookup table behind <Icon name="...">. Importing it bundles every
        // icon in the set, so only `Icon` imports it.
        "registry.ts":
          header() +
          `import type { ComponentType, SVGProps } from "react";\n` +
          entries
            .map((e) => `import ${e.componentName} from "./${e.componentName}";`)
            .join("\n") +
          `\n\nexport const ICON_COMPONENTS = {\n${lookup}\n} satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;\n\n` +
          `export type IconName = keyof typeof ICON_COMPONENTS;\n`,
      };
    },
  },
  {
    kind: "otc",
    srcDir: "src/assets/otc",
    outDir: "src/components/OtcBanner/art",
    suffix: "Art",
    // preserveAspectRatio="none" stays: the OTC patterns are stretched to their boxes.
    svgr: { dimensions: false },
    svgoPlugins: svgoUniqueIds,
    rejectRaster: true,
    barrel: ({ entries }) => ({ "index.ts": header() + entries.map(namedExport).join("\n") + `\n` }),
  },
  {
    kind: "illustrations",
    srcDir: "src/assets/illustrations",
    outDir: "src/components/Illustration/illustrations",
    suffix: "Illustration",
    // 120px by default (the Figma frame size), overridable with width/height.
    // Decorative by default: pass aria-hidden={false}, role="img" and aria-label
    // when an illustration carries meaning on its own.
    svgr: {
      dimensions: false,
      svgProps: { width: "120", height: "120", "aria-hidden": "true", focusable: "false" },
    },
    svgoPlugins: svgoUniqueIds,
    rejectRaster: true,
    barrel: ({ entries }) => ({ "index.ts": header() + entries.map(namedExport).join("\n") + `\n` }),
  },
];

function header() {
  return (
    `// GENERATED FILE — do not edit by hand.\n` +
    `// Regenerate with \`npm run generate:assets\`.\n`
  );
}

function namedExport(e) {
  return `export { default as ${e.componentName} } from "./${e.componentName}";`;
}

async function generateOne(target, srcDir, outDir, file) {
  const slug = path.basename(file, ".svg");
  const componentName = toComponentName(slug, target.suffix);
  const svgCode = await readFile(path.join(srcDir, file), "utf8");

  if (target.rejectRaster && /<image\b|data:image\//i.test(svgCode)) {
    throw new Error(
      `${file} embeds a raster image. Provide a vector SVG (trace or redraw the artwork).`,
    );
  }

  const tsCode = await transform(
    svgCode,
    {
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
      jsxRuntime: "automatic",
      typescript: true,
      ref: false,
      titleProp: false,
      expandProps: "end",
      ...target.svgr,
      svgoConfig: {
        plugins:
          typeof target.svgoPlugins === "function" ? target.svgoPlugins(slug) : target.svgoPlugins,
      },
    },
    { componentName },
  );

  await writeFile(
    path.join(outDir, `${componentName}.tsx`),
    header() + `// Source: ${path.relative(ROOT, path.join(srcDir, file))}\n` + tsCode,
  );
  return { slug, componentName };
}

async function generateTarget(target) {
  const srcDir = path.join(ROOT, target.srcDir);
  const outDir = path.join(ROOT, target.outDir);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(srcDir)).filter((f) => f.endsWith(".svg")).sort();
  const entries = [];
  for (const file of files) {
    entries.push(await generateOne(target, srcDir, outDir, file));
  }
  for (const [name, content] of Object.entries(target.barrel({ entries }))) {
    await writeFile(path.join(outDir, name), content);
  }
  console.log(`Generated ${entries.length} ${target.kind} components into ${target.outDir}/`);
}

for (const target of TARGETS) {
  await generateTarget(target);
}
