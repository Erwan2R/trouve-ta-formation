import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/serveur";

// Tracking interne (UX Analytics admin §1) : vues de page et clics CTA des fiches. Aucun cookie, ni IP ni identifiant.
const TYPES = new Set(["vue_page", "clic_telephone", "clic_email", "clic_site"]);
const ROBOTS = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor/i;
const FICHE = /^\/securite-privee\/organismes\/([a-z0-9-]+)\/?$/;

// ponytail: aucune limite de débit ; un compteur par IP (non stockée) si des volumes anormaux apparaissent.
export async function POST(requete: NextRequest) {
  if (ROBOTS.test(requete.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });
  const corps = await requete.json().catch(() => null);
  const type = corps?.type;
  const chemin = typeof corps?.chemin === "string" ? corps.chemin.split(/[?#]/)[0] : "";
  if (!TYPES.has(type) || !chemin.startsWith("/") || chemin.length > 300)
    return new NextResponse(null, { status: 400 });
  const admin = supabaseAdmin();
  const slug = chemin.match(FICHE)?.[1];
  const { data: org } = slug
    ? await admin.from("organismes").select("id").eq("slug", slug).eq("statut", "publie").maybeSingle()
    : { data: null };
  // Un clic CTA n'existe que sur une fiche publiée.
  if (type !== "vue_page" && !org) return new NextResponse(null, { status: 204 });
  await admin.from("evenements").insert({ type, chemin, organisme_id: org?.id ?? null });
  return new NextResponse(null, { status: 204 });
}
