// Production-like static preview: compression, cache headers and optional Pages base path.
import http from "node:http";
import { readFileSync, statSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";
const root = resolve("out");
const prefix = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const port = Number(process.env.PORT || 3000);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".txt": "text/plain",
};
const cache = new Map();
http
  .createServer((req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (prefix && !pathname.startsWith(prefix + "/")) {
        res.writeHead(404);
        res.end();
        return;
      }
      let file = resolve(root, "." + (pathname.slice(prefix.length) || "/"));
      if (file !== root && !file.startsWith(root + sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      if (statSync(file).isDirectory()) file = resolve(file, "index.html");
      const stat = statSync(file);
      let entry = cache.get(file);
      if (!entry || entry.modified !== stat.mtimeMs) {
        const data = readFileSync(file);
        entry = {
          modified: stat.mtimeMs,
          data,
          br: brotliCompressSync(data),
          gzip: gzipSync(data),
        };
        cache.set(file, entry);
      }
      const extension = extname(file);
      const compress = [".html", ".js", ".css", ".json", ".txt"].includes(
        extension,
      );
      const accept = req.headers["accept-encoding"] || "";
      const encoding =
        compress && accept.includes("br")
          ? "br"
          : compress && accept.includes("gzip")
            ? "gzip"
            : null;
      const body = encoding ? entry[encoding] : entry.data;
      const headers = {
        "Content-Type": mime[extension] || "application/octet-stream",
        "Content-Length": body.length,
        Vary: "Accept-Encoding",
        "Cache-Control": pathname.includes("/_next/static/")
          ? "public, max-age=31536000, immutable"
          : "public, max-age=600",
      };
      if (encoding) headers["Content-Encoding"] = encoding;
      res.writeHead(200, headers);
      res.end(req.method === "HEAD" ? undefined : body);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Static preview: http://127.0.0.1:${port}${prefix}/`),
  );
