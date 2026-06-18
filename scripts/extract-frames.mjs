// Turn a video clip into a numbered .webp frame sequence for <HeroScrub />.
//
// Usage:
//   node scripts/extract-frames.mjs <input-clip> [fps] [width]
// Example:
//   node scripts/extract-frames.mjs machine.mp4 30 1280
//
// Output: public/frames/machine/0001.webp, 0002.webp, ...
// Prints the final frame count to paste into page.tsx (MACHINE_FRAME_COUNT).

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const input = process.argv[2];
const fps = process.argv[3] ?? "30";
const width = process.argv[4] ?? "1280";

if (!input) {
  console.error("Usage: node scripts/extract-frames.mjs <input-clip> [fps] [width]");
  process.exit(1);
}

const outDir = resolve("public/frames/machine");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

console.log(`Extracting frames from ${input} at ${fps}fps, width ${width}px...`);
execFileSync(
  "ffmpeg",
  [
    "-i", input,
    "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos`,
    "-q:v", "80",
    resolve(outDir, "%04d.webp"),
  ],
  { stdio: "inherit" }
);

const count = readdirSync(outDir).filter((f) => f.endsWith(".webp")).length;
console.log(`\nDone. ${count} frames written to public/frames/machine/`);
console.log(`Set MACHINE_FRAME_COUNT = ${count} in app/page.tsx`);
