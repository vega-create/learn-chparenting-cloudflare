// Render the article's SVG diagrams to JPG for public/images/blog.
// Usage: node content-drafts/piano-sight-reading-svg/render.mjs
import sharp from "sharp";
import { readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const src = new URL(".", import.meta.url).pathname;
const out = join(process.cwd(), "public/images/blog");

for (const f of readdirSync(src).filter((f) => f.endsWith(".svg"))) {
  const svg = readFileSync(join(src, f));
  const name = basename(f, ".svg");
  await sharp(svg, { density: 144 })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(join(out, `${name}.jpg`));
  console.log("wrote", `${name}.jpg`);
}
