import { notFound } from "next/navigation";
import { SitePage } from "../../components/site-page";
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: "pl" }, { lang: "en" }];
}
export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "pl" && lang !== "en") notFound();
  return <SitePage language={lang} />;
}
