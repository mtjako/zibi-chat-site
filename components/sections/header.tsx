import { createTranslator, type Language } from "../../lib/i18n";
import { assetPath } from "../../lib/paths";
import { PreferenceInput, PlatformDownload } from "../site-controls";

export function Header({ language }: { language: Language }) {
  const t = createTranslator(language);
  return (
    <header className="header content-grid">
      <nav className="nav" aria-label={t("Nawigacja główna")}>
        <a
          className="brand"
          href="#"
          aria-label={t("Zibi Chat — początek strony")}
        >
          <img
            src={assetPath("assets/zibi-76.webp")}
            srcSet={[34, 68, 76, 152]
              .map(
                (width) =>
                  `${assetPath(`assets/zibi-${width}.webp`)} ${width}w`,
              )
              .join(", ")}
            sizes="30px"
            width="34"
            height="34"
            alt=""
          />
          {"Zibi "}
          <span>{"Chat"}</span>
        </a>
        <div className="nav-links">
          <a href="#funkcje">{t("Funkcje")}</a>
          <a href="#srodowiska">{t("Środowiska")}</a>
          <a href="#faq">{"FAQ"}</a>
        </div>
        <div className="nav-actions flex items-center gap-[9px] max-[760px]:gap-1.5">
          <div
            className="segmented"
            role="radiogroup"
            aria-label={t("Język")}
            data-language-switch=""
          >
            <label>
              <PreferenceInput type="radio" name="language" value="pl" />
              <span>{"PL"}</span>
            </label>
            <label>
              <PreferenceInput type="radio" name="language" value="en" />
              <span>{"EN"}</span>
            </label>
          </div>
          <div
            className="segmented"
            role="radiogroup"
            aria-label={t("Motyw")}
            data-theme-switch=""
          >
            <label title={t("System")}>
              <PreferenceInput
                type="radio"
                name="theme"
                value="system"
                aria-label={t("System")}
              />
              <span>
                <svg
                  className="lucide lucide-sun-moon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M12 2v2"></path>
                  <path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715"></path>
                  <path d="M16 12a4 4 0 0 0-4-4"></path>
                  <path d="m19 5-1.256 1.256"></path>
                  <path d="M20 12h2"></path>
                </svg>
              </span>
            </label>
            <label title={t("Jasny")}>
              <PreferenceInput
                type="radio"
                name="theme"
                value="light"
                aria-label={t("Jasny")}
              />
              <span>
                <svg
                  className="lucide lucide-sun"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
              </span>
            </label>
            <label title={t("Ciemny")}>
              <PreferenceInput
                type="radio"
                name="theme"
                value="dark"
                aria-label={t("Ciemny")}
              />
              <span>
                <svg
                  className="lucide lucide-moon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>
                </svg>
              </span>
            </label>
          </div>
          <PlatformDownload />
        </div>
      </nav>
    </header>
  );
}
