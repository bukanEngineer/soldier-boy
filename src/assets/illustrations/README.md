Spot illustrations from the Figma file "StraitsX - Design System", section "Section 1" (node 7496:7523): 28 components, 120 x 120.

Re-export one: select it in Figma, export as SVG, then run `node scripts/clean-figma-export.mjs <downloaded-dir> src/assets/illustrations`, which strips the page background and section frame Figma adds. Name the file after the component in kebab-case (`Document with Check` -> `document-with-check.svg`). `npm run generate:assets` turns each file into a `<Name>Illustration` component. Do not commit raster images: the generator rejects them.
