import { PageLegale } from "@/components/public/legal/PageLegale";
import { METHODE } from "@/contenu/site/methode";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: METHODE.title,
  description: METHODE.description,
  path: "/methode-de-referencement/",
});

export default function Page() {
  return <PageLegale contenu={METHODE} chemin="/methode-de-referencement/" />;
}
