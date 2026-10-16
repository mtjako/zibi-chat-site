export type ReleaseInfo = {
  version: string;
  publishedAt: string | null;
  url: string | null;
};
const installerPrefix =
  "https://github.com/mtjako/zibi-chat-releases/releases/download/";
const releasePrefix =
  "https://github.com/mtjako/zibi-chat-releases/releases/tag/";
const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

export function parseDownloadManifest(value: unknown): {
  files: Record<string, string>;
  release: ReleaseInfo | null;
} {
  const manifest = record(value);
  const files: Record<string, string> = {};
  for (const [key, entry] of Object.entries(record(manifest.files))) {
    const url = record(entry).url;
    if (typeof url === "string" && url.startsWith(installerPrefix))
      files[key] = url;
  }
  const version = manifest.version;
  if (
    typeof version !== "string" ||
    version.length > 64 ||
    !/^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)
  )
    return { files, release: null };
  const date =
    typeof manifest.pub_date === "string" &&
    /^\d{4}-\d{2}-\d{2}T/.test(manifest.pub_date) &&
    Number.isFinite(Date.parse(manifest.pub_date))
      ? new Date(manifest.pub_date).toISOString()
      : null;
  const normalizedVersion = version.replace(/^v/, "");
  const url =
    typeof manifest.release_url === "string" &&
    [
      `${releasePrefix}${normalizedVersion}`,
      `${releasePrefix}v${normalizedVersion}`,
    ].includes(manifest.release_url)
      ? manifest.release_url
      : null;
  return {
    files,
    release: { version: normalizedVersion, publishedAt: date, url },
  };
}
