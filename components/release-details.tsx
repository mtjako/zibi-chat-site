"use client";
import { useSite } from "./site-provider";

export function ReleaseDetails() {
  const { language, release, releaseLoading } = useSite();
  const copy =
    language === "pl"
      ? {
          loading: "Sprawdzanie wydania…",
          unavailable: "Informacje o wydaniu są chwilowo niedostępne.",
          version: "Wersja",
        }
      : {
          loading: "Checking the release…",
          unavailable: "Release information is currently unavailable.",
          version: "Version",
        };
  return (
    <div
      className="release-details"
      data-release-details=""
      aria-busy={releaseLoading}
    >
      {release ? (
        <>
          <span>
            {copy.version} <strong>{release.version}</strong>
          </span>
          {release.publishedAt && (
            <time dateTime={release.publishedAt}>
              {new Intl.DateTimeFormat(language === "pl" ? "pl-PL" : "en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(release.publishedAt))}
            </time>
          )}
        </>
      ) : (
        <span>{releaseLoading ? copy.loading : copy.unavailable}</span>
      )}
    </div>
  );
}
