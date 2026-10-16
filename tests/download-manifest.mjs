import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDownloadManifest } from "../lib/download-manifest.ts";

const prefix = "https://github.com/mtjako/zibi-chat-releases/releases/";
test("reads a release and its installers from the same manifest", () => {
  const result = parseDownloadManifest({
    version: "0.9.8",
    pub_date: "2026-10-15T19:12:19.102Z",
    release_url: prefix + "tag/v0.9.8",
    files: { "macos-aarch64": { url: prefix + "download/v0.9.8/zibi.dmg" } },
  });
  assert.deepEqual(result.release, {
    version: "0.9.8",
    publishedAt: "2026-10-15T19:12:19.102Z",
    url: prefix + "tag/v0.9.8",
  });
  assert.equal(
    result.files["macos-aarch64"],
    prefix + "download/v0.9.8/zibi.dmg",
  );
});
test("retains valid installers if release metadata is missing", () => {
  const { release, files } = parseDownloadManifest({
    files: { windows: { url: prefix + "download/v1.0.0/setup.exe" } },
  });
  assert.equal(release, null);
  assert.equal(Object.keys(files).length, 1);
});
test("handles invalid dates without producing Invalid Date", () => {
  assert.equal(
    parseDownloadManifest({ version: "1.0.0", pub_date: "not-a-date" }).release
      .publishedAt,
    null,
  );
});
test("rejects malformed metadata and handles null entries", () => {
  for (const value of [
    null,
    [],
    false,
    "bad",
    { version: "<script>bad</script>" },
  ])
    assert.equal(parseDownloadManifest(value).release, null);
  assert.deepEqual(parseDownloadManifest({ files: { bad: null } }).files, {});
});
test("accepts prereleases and rejects notes for another release or repository", () => {
  assert.equal(
    parseDownloadManifest({
      version: "v1.2.0-rc.1",
      release_url: prefix + "tag/v1.2.0-rc.1",
    }).release.version,
    "1.2.0-rc.1",
  );
  for (const url of [
    "javascript:alert(1)",
    "https://example.com/",
    prefix + "tag/v2.0.0",
    prefix + "tag/../../another-repo",
  ])
    assert.equal(
      parseDownloadManifest({ version: "1.0.0", release_url: url }).release.url,
      null,
    );
});
test("rejects installer URLs outside the existing releases repository", () => {
  const parsed = parseDownloadManifest({
    files: {
      a: { url: "https://example.com/setup.exe" },
      b: { url: "javascript:alert(1)" },
      c: { url: "https://github.com.evil.example/setup.exe" },
    },
  });
  assert.deepEqual(parsed.files, {});
});
