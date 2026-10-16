import { ProductShot } from "../product-shot";
import { EditorShowcase } from "../editor-showcase";
import { createTranslator, type Language } from "../../lib/i18n";

export function Editor({ language }: { language: Language }) {
  const t = createTranslator(language);
  const views = [
    { id: "code", title: t("Edytor"), description: t("Przeglądaj drzewo projektu i edytuj kod w kartach, z kolorowaniem składni."), alt: t("Edytor Zibi Chat: kod TypeScript w otwartej karcie i drzewo plików projektu"), shot: "editor" },
    { id: "git", title: "Git", description: t("Przeglądaj różnice w plikach i przygotowuj commity bez opuszczania edytora."), alt: t("Git w edytorze Zibi Chat: różnice w kodzie i lista zmienionych plików"), shot: "editor-git" },
    { id: "api", title: t("Kolekcje API"), description: t("Organizuj requesty w kolekcje, wysyłaj żądania i sprawdzaj odpowiedzi w swoim projekcie."), alt: t("Kolekcje API w Zibi Chat: żądanie GET, odpowiedź JSON i drzewo requestów"), shot: "editor-api" },
  ];
  return (
    <section className="editor-section section content-grid" id="edytor" aria-labelledby="editor-heading">
      <div className="editor-heading">
        <h2 id="editor-heading">{t("Od pomysłu")}<br />{t("do zmiany w kodzie.")}</h2>
        <p>{t("Otwórz projekt i pracuj nad nim w Zibi. Kod, agenci, Git i kolekcje API — w jednym obszarze roboczym.")}</p>
      </div>
      <EditorShowcase views={views} label={t("Poznaj edytor")}>
        <ProductShot language={language} shot="editor" alt={views[0].alt} />
      </EditorShowcase>
    </section>
  );
}
