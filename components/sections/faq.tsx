import { createTranslator, type Language } from "../../lib/i18n";

export function Faq({ language }: { language: Language }) {
  const t = createTranslator(language);
  return (
    <section className="faq-section section content-grid" id="faq">
      <div>
        <h2>
          {t("Jeszcze parę")}
          <br /> {t("szczegółów.")}
        </h2>
      </div>
      <div className="faq-list">
        <details open={true}>
          <summary>
            {t("Czym właściwie jest Zibi Chat?")}
            <span aria-hidden="true">
              <svg
                className="lucide lucide-plus"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </span>
          </summary>
          <p>
            {t(
              "To desktopowe centrum zarządzania agentami kodującymi. Zibi odczytuje z Twojego komputera informacje o użyciu, aktywnych sesjach i konfiguracji narzędzi, z których już korzystasz: Claude Code, Codex, Grok Build i Antigravity. Nie wysyła ich do nas — aplikacja nie ma telemetrii.",
            )}
          </p>
        </details>
        <details>
          <summary>
            {t("Czy Zibi zastępuje moich agentów?")}
            <span aria-hidden="true">
              <svg
                className="lucide lucide-plus"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </span>
          </summary>
          <p>
            {t(
              "Nadal pracujesz ze swoimi agentami i ich kontami. Zibi pomaga kontrolować ich pracę i ustawienia. Dostęp do modeli oraz limity wynikają z Twoich planów u poszczególnych dostawców.",
            )}
          </p>
        </details>
        <details>
          <summary>
            {t("Na jakich systemach działa aplikacja?")}
            <span aria-hidden="true">
              <svg
                className="lucide lucide-plus"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </span>
          </summary>
          <p>
            {t(
              "Zibi Chat powstaje na macOS, Windows i Linux. Instalator dla swojego systemu znajdziesz w sekcji pobierania.",
            )}
          </p>
        </details>
        <details>
          <summary>
            {t("Jak działają analizy?")}
            <span aria-hidden="true">
              <svg
                className="lucide lucide-plus"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </span>
          </summary>
          <p>
            {t(
              "Zibi analizuje historię sesji z wybranego okresu i przygotowuje rekomendacje dotyczące Twojej pracy z agentami. Generowanie raportu korzysta z modelu danego agenta i zużywa limity jego planu.",
            )}
          </p>
        </details>
        <details id="prywatnosc">
          <summary>
            {t("Czy Zibi zbiera moje dane?")}
            <span aria-hidden="true">
              <svg
                className="lucide lucide-plus"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </span>
          </summary>
          <p>
            {t(
              "Nie. Zibi Chat nie ma telemetrii, analityki ani kont, a ta strona nie używa ciasteczek ani analityki — nie zbieramy żadnych danych. Aplikacja łączy się bezpośrednio z usługami potrzebnymi do działania — dostawcami Twoich agentów, GitHubem, cennikiem models.dev i zibi.chat (sprawdzanie aktualizacji) — a gdy korzystasz z danej funkcji, także z rejestrami npm i MCP, stronami producentów narzędzi (wersje i instalacja) oraz adresami, które sam wskażesz. Każda z tych usług, podobnie jak GitHub, który hostuje tę stronę i instalatory, działa według własnej polityki prywatności.",
            )}
          </p>
        </details>
        <details id="warunki">
          <summary>
            {t("Na jakich zasadach mogę korzystać z aplikacji?")}
            <span aria-hidden="true">
              <svg
                className="lucide lucide-plus"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </span>
          </summary>
          <p>
            {t(
              "Zibi Chat jest bezpłatny i udostępniany „w stanie, w jakim jest”, bez żadnych gwarancji. W zakresie dopuszczalnym przez prawo autor nie odpowiada za szkody wynikłe z korzystania z aplikacji, w tym za utratę danych i zużycie limitów. Z usług Anthropic, OpenAI, xAI i Google korzystasz na podstawie własnych umów z tymi firmami i to Ty odpowiadasz za przestrzeganie ich regulaminów. Komponenty open source zawarte w aplikacji podlegają własnym licencjom — pełna lista jest w aplikacji: „O aplikacji” → „Licencje”.",
            )}
          </p>
        </details>
      </div>
    </section>
  );
}
