import { PageLegale } from "@/components/public/legal/PageLegale";
import { CONFIDENTIALITE } from "@/contenu/legal/confidentialite";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: CONFIDENTIALITE.title,
  description: CONFIDENTIALITE.description,
  path: "/confidentialite/",
});

export default function Page() {
  return <PageLegale contenu={CONFIDENTIALITE} chemin="/confidentialite/" />;
}
