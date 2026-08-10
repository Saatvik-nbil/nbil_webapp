// Turn a full-size camera JPEG into a web-ready hero background.
//
//   node scripts/optimize-hero.mjs <source> <public-relative-output> [width] [quality] [--flip]
//   node scripts/optimize-hero.mjs ~/Downloads/DSC03032.JPG images/heroes/our-story-hero.webp
//
// `--flip` mirrors the photo horizontally. Hero copy is left-aligned and the
// scrim is heaviest on that side, so a subject sitting on the left disappears;
// mirroring moves it into the clear half. Only safe on photos with no text.
//
// Straight-from-the-camera files are ~6000px / 6 MB, which is far too heavy to
// ship as a background. 2400px at q72 lands around 250-400 KB and still looks
// clean on a 2x display, since the hero is scrimmed and darkened anyway.

import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const flip = args.includes("--flip");
const [src, out, width = "2400", quality = "72"] = args.filter((a) => a !== "--flip");

if (!src || !out) {
  console.error("usage: node scripts/optimize-hero.mjs <source> <public-relative-output> [width] [quality] [--flip]");
  process.exit(1);
}

const dest = path.join("public", out);
await mkdir(path.dirname(dest), { recursive: true });

await sharp(src)
  .rotate() // honour EXIF orientation before we strip metadata
  .flop(flip)
  .resize({ width: Number(width), withoutEnlargement: true })
  .webp({ quality: Number(quality) })
  .toFile(dest);

const { size } = await stat(dest);
const meta = await sharp(dest).metadata();
console.log(`${dest}  ${meta.width}x${meta.height}  ${(size / 1024).toFixed(0)} KB`);
