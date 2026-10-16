import { createTranslator, type Language } from "../lib/i18n";
export function TrustNotes({ language }: { language: Language }) {
  const t = createTranslator(language);
  return (
    <ul className="trust-notes" aria-label={t("Co warto wiedzieć")}>
      {["Bezpłatnie", "Bez konta", "Bez telemetrii"].map((text) => (
        <li key={text}>{t(text)}</li>
      ))}
    </ul>
  );
}
