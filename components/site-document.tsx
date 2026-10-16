import type { ReactNode } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createTranslator } from "../lib/i18n";
import { basePath } from "../lib/paths";
import { SiteProvider } from "./site-provider";
import { assetPath } from "../lib/paths";
import "../app/globals.css";

const title = "Zibi Chat — Twoje harnessy AI. Wszystko pod kontrolą.";
const description =
  "Claude Code, Codex, Grok Build i Antigravity w jednym miejscu. Śledź limity, koszty i sesje. Uporządkuj konfigurację swoich harnessów z Zibi Chat.";
const ogDescription =
  "Mała aplikacja. Pełny obraz pracy z agentami AI. Limity, sesje, statystyki i konfiguracja w jednym miejscu.";
const ogAlt =
  "Zibi Chat: Ty tworzysz. Zibi ogarnia resztę. Okno aplikacji z limitami planu i podsumowaniem sesji.";

export function SiteDocument({
  children,
  language,
}: {
  children: ReactNode;
  language: "pl" | "en";
}) {
  const t = createTranslator(language);
  const bootstrap =
    `window.zibiPage=${JSON.stringify({ language, basePath })};` +
    readFileSync(join(process.cwd(), "public/preferences.js"), "utf8");
  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <title>{t(title)}</title>
        <meta
          name="description"
          content={t(description)}
          data-source={description}
        />
        <meta
          name="robots"
          content="noindex, nofollow, noarchive, nosnippet, noimageindex"
        />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content={t(title)} data-source={title} />
        <meta
          property="og:description"
          content={t(ogDescription)}
          data-source={ogDescription}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:locale"
          content={language === "pl" ? "pl_PL" : "en_US"}
        />
        <meta property="og:url" content="https://zibi.chat/" />
        <meta
          property="og:image"
          content="https://zibi.chat/assets/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t(ogAlt)} data-source={ogAlt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://zibi.chat/assets/og-image.png"
        />
        <link
          rel="icon"
          type="image/webp"
          href={assetPath("assets/zibi-34.webp")}
        />
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
        <script src={assetPath("motion.js")} defer fetchPriority="low" />
      </head>
      <body>
        <SiteProvider language={language}>{children}</SiteProvider>
      </body>
    </html>
  );
}
