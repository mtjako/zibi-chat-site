import { ReleaseDetails } from "../release-details";
import { createTranslator, type Language } from "../../lib/i18n";
import { assetPath } from "../../lib/paths";
import {
  LinuxDownload,
  InstallerLink,
  LinuxPackageLink,
  LinuxToggle,
  LinuxMenu,
  DownloadStatus,
} from "../site-controls";

export function Downloads({ language }: { language: Language }) {
  const t = createTranslator(language);
  return (
    <section className="download-section content-grid" id="pobierz">
      <div className="download-inner">
        <img
          className="download-icon"
          loading="lazy"
          src={assetPath("assets/zibi-76.webp")}
          srcSet={[34, 68, 76, 152]
            .map(
              (width) => `${assetPath(`assets/zibi-${width}.webp`)} ${width}w`,
            )
            .join(", ")}
          sizes="76px"
          alt=""
          width="76"
          height="76"
        />
        <h2>
          {t("Daj swoim agentom")}
          <br /> {t("wspólny dom.")}
        </h2>
        <p>{t("Twój następny pomysł zasługuje na pełne skupienie.")}</p>
        <div className="download-buttons">
          <InstallerLink
            className="button small dark download-link"
            data-platform="macos"
          >
            <svg
              className="platform-icon"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M17.05 12.54c.02 3.03 2.66 4.04 2.69 4.05-.02.07-.42 1.44-1.39 2.85-.84 1.22-1.71 2.44-3.08 2.46-1.35.03-1.78-.8-3.32-.8-1.54 0-2.03.77-3.3.83-1.32.05-2.33-1.32-3.18-2.54-1.73-2.51-3.05-7.1-1.28-10.2a4.93 4.93 0 0 1 4.17-2.53c1.3-.02 2.53.88 3.32.88.8 0 2.28-1.09 3.84-.93.65.03 2.5.26 3.69 1.99-.1.06-2.2 1.28-2.16 3.94ZM14.53 4.99c.71-.86 1.19-2.05 1.06-3.24-1.02.04-2.25.68-2.98 1.53-.66.75-1.24 1.97-1.08 3.12 1.14.09 2.29-.58 3-1.41Z"></path>
            </svg>{" "}
            {t("Pobierz na macOS")}
          </InstallerLink>
          <InstallerLink
            className="button small light download-link"
            data-platform="windows"
          >
            <svg
              className="platform-icon"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M2 4.6 10.2 3.5v8H2zm9.5-1.3L22 1.8v9.7H11.5zM2 12.8h8.2v8L2 19.7zm9.5 0H22v9.5l-10.5-1.4z"></path>
            </svg>
            {" Windows"}
          </InstallerLink>
          <LinuxDownload>
            <LinuxToggle
              type="button"
              className="button small light download-link"
              data-platform="linux"
              data-linux-toggle=""
              aria-haspopup="menu"
              aria-controls="linux-menu"
            >
              <svg
                className="platform-icon"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M8.2 17.8c-1.8-1.1-2.1-3.1-1.2-5.4.6-1.5 1.8-3 1.8-5.1 0-3.2 1.2-5.3 3.3-5.3s3.4 2.1 3.4 5.3c0 2.1 1.3 3.6 1.9 5.1.9 2.3.5 4.3-1.3 5.4l-1.1 1.9H9.3z"></path>
                <ellipse
                  cx="12.1"
                  cy="13.8"
                  rx="3.1"
                  ry="4.6"
                  fill="var(--button-icon-cutout, var(--control))"
                ></ellipse>
                <ellipse
                  cx="10.8"
                  cy="6.7"
                  rx=".75"
                  ry="1.05"
                  fill="var(--button-icon-cutout, var(--control))"
                ></ellipse>
                <ellipse
                  cx="13.4"
                  cy="6.7"
                  rx=".75"
                  ry="1.05"
                  fill="var(--button-icon-cutout, var(--control))"
                ></ellipse>
                <path d="m9.8 8.5 2.3-1.2 2.3 1.2-2.3 1.8zM7.4 17.1l3.1 2-1.1 2.8L3 20.4l2.2-2.9zm9.3 0 2.2.4 2.2 2.9-6.4 1.5-1.1-2.8z"></path>
              </svg>
              {" Linux "}
              <svg
                className="linux-chevron"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </LinuxToggle>
            <LinuxMenu
              className="linux-menu"
              id="linux-menu"
              role="menu"
              aria-label={t("Wybierz paczkę dla Linuksa")}
            >
              <p className="linux-menu-group" role="presentation">
                {"x86_64 (Intel, AMD)"}
              </p>
              <LinuxPackageLink
                className="linux-menu-item flex justify-between items-baseline gap-4 rounded-[var(--menu-item-radius)] p-2"
                data-linux-file="linux-x86_64-appimage"
                role="menuitem"
              >
                {"AppImage"}
                <span>{t("Każda dystrybucja")}</span>
              </LinuxPackageLink>
              <LinuxPackageLink
                className="linux-menu-item flex justify-between items-baseline gap-4 rounded-[var(--menu-item-radius)] p-2"
                data-linux-file="linux-x86_64-deb"
                role="menuitem"
              >
                {"DEB"}
                <span>{"Debian, Ubuntu"}</span>
              </LinuxPackageLink>
              <LinuxPackageLink
                className="linux-menu-item flex justify-between items-baseline gap-4 rounded-[var(--menu-item-radius)] p-2"
                data-linux-file="linux-x86_64-rpm"
                role="menuitem"
              >
                {"RPM"}
                <span>{"Fedora, openSUSE"}</span>
              </LinuxPackageLink>
              <p className="linux-menu-group" role="presentation">
                {"ARM64"}
              </p>
              <LinuxPackageLink
                className="linux-menu-item flex justify-between items-baseline gap-4 rounded-[var(--menu-item-radius)] p-2"
                data-linux-file="linux-aarch64-appimage"
                role="menuitem"
              >
                {"AppImage"}
                <span>{t("Każda dystrybucja")}</span>
              </LinuxPackageLink>
              <LinuxPackageLink
                className="linux-menu-item flex justify-between items-baseline gap-4 rounded-[var(--menu-item-radius)] p-2"
                data-linux-file="linux-aarch64-deb"
                role="menuitem"
              >
                {"DEB"}
                <span>{"Debian, Ubuntu"}</span>
              </LinuxPackageLink>
              <LinuxPackageLink
                className="linux-menu-item flex justify-between items-baseline gap-4 rounded-[var(--menu-item-radius)] p-2"
                data-linux-file="linux-aarch64-rpm"
                role="menuitem"
              >
                {"RPM"}
                <span>{"Fedora, openSUSE"}</span>
              </LinuxPackageLink>
            </LinuxMenu>
          </LinuxDownload>
        </div>
        <ReleaseDetails />
        <DownloadStatus />
      </div>
    </section>
  );
}
