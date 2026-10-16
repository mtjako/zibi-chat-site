import { ProductShot } from "../product-shot";
import { createTranslator, type Language } from "../../lib/i18n";

export function Environments({ language }: { language: Language }) {
  const t = createTranslator(language);
  return (
    <section className="menubar-section content-grid" id="srodowiska">
      <div className="menubar-heading">
        <h2>
          {t("Wszystkie harnessy.")}
          <br /> {t("Zawsze aktualne.")}
        </h2>
        <p>
          {t(
            "Zibi sprawdza wersje Claude Code, Codexa, Grok Build i Antigravity, podpowiada aktualizacje i doinstalowuje brakujące narzędzia — na macOS, Windows i Linuksie.",
          )}
        </p>
      </div>
      <div className="screenshot-frame environments-frame relative overflow-clip rounded-xl max-[520px]:rounded-[7px] border border-[var(--line)] bg-[var(--surface)]">
        <ProductShot
          language={language}
          shot="environments"
          alt={t(
            "Widok Środowiska w Zibi Chat: wersje, aktualizacje i instalacja harnessów",
          )}
        />
      </div>
    </section>
  );
}
