import { PageLegale } from "@/components/public/legal/PageLegale";
import { CONDITIONS } from "@/contenu/legal/conditions";
import { buildMetadata, SITE_NAME } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: `${CONDITIONS.title} — ${SITE_NAME}`,
  description: CONDITIONS.description,
  path: "/conditions-utilisation/",
});

export default function Page() {
  return <PageLegale contenu={CONDITIONS} chemin="/conditions-utilisation/" />;
}
