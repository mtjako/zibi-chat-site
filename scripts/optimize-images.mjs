import { readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const directory = new URL("../public/assets/", import.meta.url);
for (const name of readdirSync(directory)) {
  if (!/^(session|environments|editor(?:-agents|-git|-api)?)-(pl|en)-(light|dark)\.png$/.test(name))
    continue;
  for (const width of [480, 720, 800, 1100, 1600, 2200])
    execFileSync("cwebp", [
      "-quiet",
      "-q",
      "82",
      "-m",
      "6",
      "-resize",
      String(width),
      "0",
      new URL(name, directory).pathname,
      "-o",
      new URL(name.replace(".png", `-${width}.webp`), directory).pathname,
    ]);
}
for (const width of [34, 68, 76, 152])
  execFileSync("cwebp", [
    "-quiet",
    "-lossless",
    "-resize",
    String(width),
    "0",
    new URL("zibi.png", directory).pathname,
    "-o",
    new URL(`zibi-${width}.webp`, directory).pathname,
  ]);
console.log("Generated responsive WebP screenshots and logos.");
