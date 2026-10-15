import { PageLegale } from "@/components/public/legal/PageLegale";
import { A_PROPOS } from "@/contenu/site/a-propos";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata, SITE_URL } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: A_PROPOS.title,
  description: A_PROPOS.description,
  path: "/a-propos/",
});

export default function Page() {
  return (
    <>
      <JsonLd data={{ "@type": "AboutPage", name: A_PROPOS.h1, about: { "@id": `${SITE_URL}/#organization` } }} />
      <PageLegale contenu={A_PROPOS} chemin="/a-propos/" />
    </>
  );
}
