import { createTranslator, type Language } from "../../lib/i18n";
import { assetPath } from "../../lib/paths";
import { CurrentYear } from "../site-controls";

export function Footer({ language }: { language: Language }) {
  const t = createTranslator(language);
  return (
    <footer className="site-footer content-grid">
      <div className="footer">
        <a className="brand" href="#">
          <img
            loading="lazy"
            src={assetPath("assets/zibi-76.webp")}
            srcSet={[34, 68, 76, 152]
              .map(
                (width) =>
                  `${assetPath(`assets/zibi-${width}.webp`)} ${width}w`,
              )
              .join(", ")}
            sizes="22px"
            width="28"
            height="28"
            alt=""
          />
          {"Zibi "}
          <span>{"Chat"}</span>
        </a>
        <p>{t("Mała aplikacja dla wielkich pomysłów.")}</p>
        <span>
          {"© "}
          <CurrentYear />
          {" Zibi Chat"}
        </span>
      </div>
      <p className="trademark-note">
        {t(
          "Claude Code, Codex, Grok Build i Antigravity są znakami towarowymi ich właścicieli. Zibi Chat jest niezależnym projektem i nie jest z nimi powiązany.",
        )}
      </p>
    </footer>
  );
}
