import { PageLegale } from "@/components/public/legal/PageLegale";
import { COOKIES } from "@/contenu/legal/cookies";
import { buildMetadata, SITE_NAME } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: `${COOKIES.title} — ${SITE_NAME}`,
  description: COOKIES.description,
  path: "/cookies/",
});

export default function Page() {
  return <PageLegale contenu={COOKIES} chemin="/cookies/" />;
}
