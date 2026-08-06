// Babel emits dist/**/*.js but leaves relative import specifiers pointing at
// the original ".jsx" filenames (e.g. `from "./Button.jsx"`). Node's ESM
// loader refuses to load a ".jsx" extension, so every such specifier has to
// be rewritten to ".js" post-build. Runs against both dist/**/*.js and the
// tsc-emitted dist/**/*.d.ts, which have the same stale specifiers.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const SPECIFIER = /(from\s+["']|import\s*\(\s*["'])(\.[^"']+)\.jsx(["'])/g;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) files.push(full);
  }
  return files;
}

const files = await walk(DIST);
let changed = 0;
for (const file of files) {
  const content = await readFile(file, "utf8");
  const next = content.replace(SPECIFIER, "$1$2.js$3");
  if (next !== content) {
    await writeFile(file, next);
    changed++;
  }
}
console.log(`Rewrote .jsx import specifiers in ${changed} file(s).`);
