import type { ReactNode } from "react";
import { SiteDocument } from "../../components/site-document";
export default async function LanguageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <SiteDocument language={lang === "en" ? "en" : "pl"}>
      {children}
    </SiteDocument>
  );
}
