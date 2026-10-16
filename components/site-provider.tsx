"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { basePath, assetPath } from "../lib/paths";
import {
  parseDownloadManifest,
  type ReleaseInfo,
} from "../lib/download-manifest";
const english: Record<string, string> = {
  "Pobierz Zibi Chat": "Download Zibi Chat",
  "Pobierz na macOS": "Download for macOS",
  "Pobierz na Windows": "Download for Windows",
  "Pobierz na Linux": "Download for Linux",
  "Ten instalator nie jest jeszcze dostępny. Zajrzyj ponownie wkrótce.":
    "This installer is not available yet. Check back soon.",
  "Wybierz instalator dla swojego systemu.":
    "Choose the installer for your operating system.",
  "Instalatory pojawią się wkrótce.": "Installers are coming soon.",
};

type Language = "pl" | "en";
type Theme = "system" | "light" | "dark";
type Platform = "macos" | "windows" | "linux";
type UserAgentData = {
  platform?: string;
  getHighEntropyValues?: (
    hints: string[],
  ) => Promise<{ architecture?: string }>;
};
type SiteState = {
  language: Language;
  theme: Theme;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (text: string) => string;
  platform: Platform | null;
  downloads: Record<string, string>;
  release: ReleaseInfo | null;
  releaseLoading: boolean;
  downloadClicked: boolean;
  unavailable: () => void;
  today: Date | null;
};
const Context = createContext<SiteState | null>(null);
const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Optional persistence. */
  }
};
const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export function SiteProvider({
  children,
  language,
}: {
  children: ReactNode;
  language: Language;
}) {
  // Identical initial state for the server and hydration; stored preferences apply after mounting.
  const [theme, updateTheme] = useState<Theme>("system");
  const [ready, setReady] = useState(false);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [downloads, setDownloads] = useState<Record<string, string>>({});
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [releaseLoading, setReleaseLoading] = useState(true);
  const [downloadClicked, setDownloadClicked] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  const t = (text: string) =>
    language === "en" ? (english[text] ?? text) : text;

  useEffect(() => {
    const storedTheme = read("zibi-site-theme");
    updateTheme(
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : "system",
    );
    setReady(true);
    setToday(new Date());
    const uaData = (navigator as Navigator & { userAgentData?: UserAgentData })
      .userAgentData;
    const device = uaData?.platform || navigator.platform || "";
    const ua = navigator.userAgent;
    if (
      !/Android|iPhone|iPad|iPod|CrOS/i.test(ua) &&
      !(/Mac/i.test(device) && navigator.maxTouchPoints > 1)
    ) {
      setPlatform(
        /Win/i.test(device + ua)
          ? "windows"
          : /Mac/i.test(device + ua)
            ? "macos"
            : /Linux/i.test(device + ua)
              ? "linux"
              : null,
      );
    }
    const abort = new AbortController();
    async function load() {
      try {
        const response = await fetch(assetPath("updates/downloads.json"), {
          cache: "no-cache",
          signal: abort.signal,
        });
        if (!response.ok) {
          if (!abort.signal.aborted) setReleaseLoading(false);
          return;
        }
        const { files: urls, release: metadata } = parseDownloadManifest(
          await response.json(),
        );
        let architecture = "x86_64";
        try {
          if (
            (await uaData?.getHighEntropyValues?.(["architecture"]))
              ?.architecture === "arm"
          )
            architecture = "aarch64";
        } catch {
          /* x86 fallback */
        }
        urls.macos = urls["macos-aarch64"] || "";
        urls.windows = urls["windows-x86_64"] || "";
        urls.linux =
          urls[`linux-${architecture}-appimage`] ||
          urls["linux-x86_64-appimage"] ||
          "";
        if (!abort.signal.aborted) {
          setDownloads(urls);
          setRelease(metadata);
          setReleaseLoading(false);
        }
      } catch {
        if (!abort.signal.aborted) setReleaseLoading(false);
        /* Offline or no published release: keep the unavailable state. */
      }
    }
    void load();
    return () => abort.abort();
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.sitePreferences?.setTheme(theme);
  }, [theme, ready]);

  return (
    <Context.Provider
      value={{
        language,
        theme,
        t,
        platform,
        downloads,
        release,
        releaseLoading,
        today,
        downloadClicked,
        unavailable: () => setDownloadClicked(true),
        setLanguage: (value) => {
          save("zibi-site-language", value);
          const url = new URL(location.href);
          url.pathname = `${basePath}/${value}/`;
          url.searchParams.delete("lang");
          location.assign(url);
        },
        setTheme: (value) => {
          updateTheme(value);
          save("zibi-site-theme", value);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useSite() {
  const state = useContext(Context);
  if (!state) throw new Error("SiteProvider is required");
  return state;
}
