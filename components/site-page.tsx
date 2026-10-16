import { createTranslator, type Language } from "../lib/i18n";
import { Header } from "./sections/header";
import { Hero } from "./sections/hero";
import { Features } from "./sections/features";
import { Editor } from "./sections/editor";
import { Environments } from "./sections/environments";
import { Faq } from "./sections/faq";
import { Downloads } from "./sections/downloads";
import { Footer } from "./sections/footer";

export function SitePage({ language }: { language: Language }) {
  const t = createTranslator(language);
  return (
    <>
      <a className="skip-link" href="#main">
        {t("Przejdź do treści")}
      </a>
      <Header language={language} />
      <main id="main">
        <Hero language={language} />
        <Features language={language} />
        <Editor language={language} />
        <Environments language={language} />
        <Faq language={language} />
        <Downloads language={language} />
      </main>
      <Footer language={language} />
    </>
  );
}
