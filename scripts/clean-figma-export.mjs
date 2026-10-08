// Cleans SVGs exported from a Figma component that sits inside a Section.
//
// Figma's node export renders the component with its surroundings: a page
// background rect and the Section's white card + border paths wrap the actual
// artwork. This removes them and keeps the artwork group and its <defs>:
//
//   <rect fill="#F5F5F5"/>                      <- removed
//   <g id="Section 1">
//     <path fill="white"/>                      <- removed (section card)
//     <path fill="black" fill-opacity="0.1"/>   <- removed (section border)
//     <g id="Rocket"> ... </g>                  <- kept, unwrapped
//   </g>
//
// Usage:  node scripts/clean-figma-export.mjs <input-dir> <output-dir>
// Every *.svg in <input-dir> is cleaned into <output-dir>. Files that do not
// match the expected structure are reported and skipped, never guessed at.
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [inputDir, outputDir] = process.argv.slice(2);
if (!inputDir || !outputDir) {
  console.error("Usage: node scripts/clean-figma-export.mjs <input-dir> <output-dir>");
  process.exit(1);
}

const BACKGROUND = /<rect\b[^>]*\bfill="#F5F5F5"[^>]*\/>\s*/;
const SECTION_OPEN =
  /<g id="Section[^"]*">\s*<path\b[^>]*\bfill="white"[^>]*\/>\s*<path\b[^>]*\bfill-opacity="0\.1"[^>]*\/>\s*/;
const SECTION_CLOSE = /<\/g>(\s*(?:<defs>|<\/svg>))/;

function clean(svg) {
  if (!BACKGROUND.test(svg) || !SECTION_OPEN.test(svg)) return null;
  return svg.replace(BACKGROUND, "").replace(SECTION_OPEN, "").replace(SECTION_CLOSE, "$1");
}

await mkdir(outputDir, { recursive: true });
let cleaned = 0;
for (const file of (await readdir(inputDir)).filter((f) => f.endsWith(".svg")).sort()) {
  const out = clean(await readFile(path.join(inputDir, file), "utf8"));
  if (out === null) {
    console.warn(`skipped ${file}: no page background / section frame found`);
    continue;
  }
  await writeFile(path.join(outputDir, file), out);
  cleaned++;
}
console.log(`Cleaned ${cleaned} SVG(s) into ${outputDir}`);
