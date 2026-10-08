// Vendors the Material Symbols (Rounded, weight 500) SVGs the package uses into
// src/assets/icons/, so the icon set is self-hosted instead of loaded from
// Google Fonts. scripts/generate-svg-components.mjs turns them into components.
//
// Which icons: every quoted string or JSX text in src/**/*.{ts,tsx} that is
// the name of a Material Symbol (e.g. `icon="more_vert"`), plus the names in
// scripts/icon-extras.json. Run it again after using a new icon name:
//
//   npm run vendor:icons
//
// Needs network (it downloads the @material-symbols/svg-500 tarball once into
// .cache/). Apache-2.0 licensed; the licence is copied next to the SVGs.
import { execFileSync } from "node:child_process";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const VERSION = "0.47.6";
// Weight 500, not 400: the SVGs are drawn at optical size 48, whose strokes look
// thinner than the old font (optical size 24) when shown at 24px. 500 matches it.
const WEIGHT = 500;
const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const OUT_DIR = path.join(ROOT, "src/assets/icons");
const CACHE = path.join(ROOT, ".cache/material-symbols");
const EXTRAS = path.join(ROOT, "scripts/icon-extras.json");
const IGNORE = path.join(ROOT, "scripts/icon-ignore.json");
const ALIASES = path.join(ROOT, "scripts/icon-aliases.json");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || full === OUT_DIR) continue;
      out.push(...(await walk(full)));
    } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  await rm(CACHE, { recursive: true, force: true });
  await mkdir(CACHE, { recursive: true });
  execFileSync(
    "npm",
    ["pack", `@material-symbols/svg-${WEIGHT}@${VERSION}`, "--pack-destination", CACHE, "--silent"],
    { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] },
  );
  const tarball = (await readdir(CACHE)).find((f) => f.endsWith(".tgz"));
  execFileSync("tar", ["-xzf", tarball], { cwd: CACHE });

  const rounded = path.join(CACHE, "package/rounded");
  const available = new Set(
    (await readdir(rounded))
      .filter((f) => f.endsWith(".svg") && !f.endsWith("-fill.svg"))
      .map((f) => f.slice(0, -4))
      // Component names cannot start with a digit (10k, 3d_rotation, ...).
      .filter((name) => /^[a-z]/.test(name)),
  );

  // Plain words that are also Material Symbol names but are not used as icons here.
  const ignored = new Set(JSON.parse(await readFile(IGNORE, "utf8")));
  // Names the old icon font accepted that the SVG package no longer has,
  // mapped to the current name (e.g. expand_more -> keyboard_arrow_down). They
  // stay valid `name` values and are vendored under the old name.
  const aliases = JSON.parse(await readFile(ALIASES, "utf8"));
  const wanted = new Set();
  for (const file of await walk(SRC_DIR)) {
    const text = await readFile(file, "utf8");
    // Quoted strings and JSX text (which may sit on its own line).
    for (const m of text.matchAll(/["'`>]\s*([a-z][a-z0-9]*(?:_[a-z0-9]+)*)\s*["'`<]/g)) {
      if ((available.has(m[1]) || aliases[m[1]]) && !ignored.has(m[1])) wanted.add(m[1]);
    }
  }
  for (const name of JSON.parse(await readFile(EXTRAS, "utf8"))) {
    if (!available.has(name) && !aliases[name]) {
      throw new Error(`icon-extras.json: "${name}" is not a Material Symbol`);
    }
    wanted.add(name);
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  for (const name of [...wanted].sort()) {
    const source = available.has(name) ? name : aliases[name];
    if (!available.has(source))
      throw new Error(`icon-aliases.json: "${source}" is not a Material Symbol`);
    await cp(path.join(rounded, `${source}.svg`), path.join(OUT_DIR, `${name}.svg`));
  }
  await cp(path.join(CACHE, "package/LICENSE"), path.join(OUT_DIR, "LICENSE"));
  await writeFile(
    path.join(OUT_DIR, "README.md"),
    `Material Symbols Rounded, weight ${WEIGHT}, from @material-symbols/svg-${WEIGHT}@${VERSION} (Apache-2.0, see LICENSE).\n` +
      `Do not edit by hand: \`npm run vendor:icons\` rewrites this folder from the names used in src/ and scripts/icon-extras.json.\n`,
  );
  await rm(CACHE, { recursive: true, force: true });
  console.log(`Vendored ${wanted.size} icons into ${path.relative(ROOT, OUT_DIR)}/`);
}

await main();
