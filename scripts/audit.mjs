import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = resolve(root, ".reports/lighthouse");
const runs = Number(process.env.LH_RUNS || 3);
if (!Number.isInteger(runs) || runs < 1 || runs > 10)
  throw new Error("LH_RUNS must be between 1 and 10");
const port = Number(process.env.PORT || 4173);
const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
const url = `http://127.0.0.1:${port}${prefix}${process.env.LH_PATH || "/?lang=pl"}`;
mkdirSync(directory, { recursive: true });
const server = spawn(
  process.execPath,
  [fileURLToPath(new URL("./preview.mjs", import.meta.url))],
  {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "inherit"],
  },
);
let serverError;
server.on("error", (error) => {
  serverError = error;
});
const results = [];
const median = (values) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
try {
  await new Promise((resolveReady, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Preview server did not start")),
      10000,
    );
    server.stdout.on("data", (data) => {
      if (data.toString().includes("Static preview:")) {
        clearTimeout(timer);
        resolveReady();
      }
    });
    server.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Preview exited: ${code}`));
    });
  });
  if (serverError) throw serverError;
  for (const mode of ["mobile", "desktop"]) {
    for (let run = 1; run <= runs; run++) {
      const path = resolve(directory, `${mode}-${run}`);
      console.log(`Lighthouse ${mode} ${run}/${runs}: ${url}`);
      const args = [
        "exec",
        "--yes",
        "--package=lighthouse@13.5.0",
        "--",
        "lighthouse",
        url,
        "--chrome-flags=--headless",
        "--output=html",
        "--output=json",
        `--output-path=${path}`,
        "--quiet",
      ];
      if (mode === "desktop") args.push("--preset=desktop");
      await new Promise((done, reject) => {
        const process = spawn("npm", args, { cwd: root, stdio: "inherit" });
        process.on("error", reject);
        process.on("exit", (code) =>
          code === 0 ? done() : reject(new Error(`Lighthouse exited: ${code}`)),
        );
      });
      const report = JSON.parse(readFileSync(`${path}.report.json`, "utf8"));
      if (report.runtimeError) throw new Error(report.runtimeError.message);
      const scores = Object.fromEntries(
        ["performance", "accessibility", "best-practices", "seo"].map((key) => [
          key,
          Math.round(report.categories[key].score * 100),
        ]),
      );
      const metrics = Object.fromEntries(
        [
          "first-contentful-paint",
          "largest-contentful-paint",
          "total-blocking-time",
          "cumulative-layout-shift",
        ].map((key) => [key, report.audits[key].numericValue]),
      );
      results.push({ mode, run, scores, metrics });
      console.log(JSON.stringify(results.at(-1)));
    }
  }
  const medians = Object.fromEntries(
    ["mobile", "desktop"].map((mode) => {
      const selected = results.filter((result) => result.mode === mode);
      return [
        mode,
        {
          scores: Object.fromEntries(
            Object.keys(selected[0].scores).map((key) => [
              key,
              median(selected.map((result) => result.scores[key])),
            ]),
          ),
          metrics: Object.fromEntries(
            Object.keys(selected[0].metrics).map((key) => [
              key,
              median(selected.map((result) => result.metrics[key])),
            ]),
          ),
        },
      ];
    }),
  );
  const summary = {
    date: new Date().toISOString(),
    url,
    lighthouse: "13.5.0",
    runs,
    medians,
    results,
  };
  writeFileSync(
    resolve(directory, "summary.json"),
    JSON.stringify(summary, null, 2) + "\n",
  );
  console.log("Median results:", JSON.stringify(medians, null, 2));
  console.log(`Reports: ${directory}`);
} finally {
  server.kill("SIGTERM");
}
