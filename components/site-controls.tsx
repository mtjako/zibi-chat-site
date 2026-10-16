"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { useSite } from "./site-provider";
import { PlatformIcon } from "./platform-icon";

export function PlatformDownload() {
  const { platform, downloads, t } = useSite();
  const labels = {
    macos: "Pobierz na macOS",
    windows: "Pobierz na Windows",
    linux: "Pobierz na Linux",
  };
  return (
    <a
      className="button small dark download-cta"
      data-platform-download=""
      href={(platform && downloads[platform]) || "#pobierz"}
    >
      {platform ? (
        <PlatformIcon platform={platform} />
      ) : (
        <span data-platform-download-icon="" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14m7-7-7 7-7-7" />
          </svg>
        </span>
      )}
      <span>{t(platform ? labels[platform] : "Pobierz Zibi Chat")}</span>
    </a>
  );
}

export function InstallerLink(
  props: ComponentProps<"a"> & { "data-platform": string },
) {
  const { downloads, unavailable } = useSite();
  const url = downloads[props["data-platform"]];
  return (
    <a
      {...props}
      href={url || "#pobierz"}
      aria-disabled={!url || undefined}
      onClick={(event) => {
        if (!url) {
          event.preventDefault();
          unavailable();
        }
      }}
    />
  );
}

// Linux toggle/menu share one small local context through their section boundary.
const LinuxContext = createContext({
  open: false,
  setOpen: (_: boolean) => {},
  toggle: { current: null } as { current: HTMLButtonElement | null },
});
export function LinuxDownload({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const click = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("click", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <LinuxContext.Provider value={{ open, setOpen, toggle }}>
      <div
        ref={container}
        className="linux-download relative inline-flex"
        data-linux-download=""
      >
        {children}
      </div>
    </LinuxContext.Provider>
  );
}
export function LinuxToggle(props: ComponentProps<"button">) {
  const { downloads, unavailable } = useSite();
  const { open, setOpen, toggle } = useContext(LinuxContext);
  return (
    <button
      {...props}
      ref={toggle}
      aria-expanded={open}
      onClick={() => {
        if (!Object.keys(downloads).some((key) => key.startsWith("linux-")))
          unavailable();
        else setOpen(!open);
      }}
    />
  );
}
export function LinuxMenu(props: ComponentProps<"div">) {
  const { open } = useContext(LinuxContext);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) ref.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
  }, [open]);
  return (
    <div
      {...props}
      ref={ref}
      hidden={!open}
      onKeyDown={(event) => {
        const items = [
          ...(ref.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ||
            []),
        ];
        if (
          !items.length ||
          !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
        )
          return;
        event.preventDefault();
        const index = items.indexOf(
          document.activeElement as HTMLAnchorElement,
        );
        items[
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
                items.length
        ]?.focus();
      }}
    />
  );
}
export function LinuxPackageLink(
  props: ComponentProps<"a"> & { "data-linux-file": string },
) {
  const { downloads } = useSite();
  const { setOpen } = useContext(LinuxContext);
  const url = downloads[props["data-linux-file"]];
  return (
    <a
      {...props}
      href={url || undefined}
      aria-disabled={!url || undefined}
      tabIndex={url ? undefined : -1}
      onClick={() => setOpen(false)}
    />
  );
}
export function DownloadStatus() {
  const { t, downloads, downloadClicked } = useSite();
  return (
    <p className="download-note" id="download-status" role="status">
      {t(
        downloadClicked
          ? "Ten instalator nie jest jeszcze dostępny. Zajrzyj ponownie wkrótce."
          : Object.values(downloads).some(Boolean)
            ? "Wybierz instalator dla swojego systemu."
            : "Instalatory pojawią się wkrótce.",
      )}
    </p>
  );
}
export function CurrentYear() {
  const { today } = useSite();
  return <span id="year">{today?.getFullYear() ?? 2026}</span>;
}
export function ChartDate({
  day,
  ...props
}: ComponentProps<"text"> & { day: number }) {
  const { today } = useSite();
  const date = today
    ? new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 13 + day,
      )
    : null;
  const label = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : ["2026-09-27", "2026-10-01", "2026-10-05", "2026-10-10"][
        [0, 4, 8, 13].indexOf(day)
      ];
  return (
    <text {...props} data-chart-day={day}>
      {label}
    </text>
  );
}

export function PreferenceInput(props: ComponentProps<"input">) {
  const { language, theme, setLanguage, setTheme } = useSite();
  const value = String(props.value);
  return (
    <input
      {...props}
      checked={props.name === "language" ? language === value : theme === value}
      onChange={() => {
        if (props.name === "language" && (value === "pl" || value === "en"))
          setLanguage(value);
        if (
          props.name === "theme" &&
          (value === "light" || value === "dark" || value === "system")
        )
          setTheme(value);
      }}
    />
  );
}
