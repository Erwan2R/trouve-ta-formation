import { PageLegale } from "@/components/public/legal/PageLegale";
import { MENTIONS_LEGALES } from "@/contenu/legal/mentions-legales";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: MENTIONS_LEGALES.title,
  description: MENTIONS_LEGALES.description,
  path: "/mentions-legales/",
});

export default function Page() {
  return <PageLegale contenu={MENTIONS_LEGALES} chemin="/mentions-legales/" />;
}
