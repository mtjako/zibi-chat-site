import type { ReactNode } from "react";
import { SiteDocument } from "../../components/site-document";
export default function EntryLayout({ children }: { children: ReactNode }) {
  return <SiteDocument language="pl">{children}</SiteDocument>;
}
