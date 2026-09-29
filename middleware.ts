import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { estHoteAdmin, estHoteEspace, PAGES_PUBLIQUES_ESPACE, PREFIXE_ESPACE } from "@/lib/espace";

/**
 * Sous-domaine partenaires. → pages de app/partenaires/, avec rafraîchissement de la session Supabase
 * et accès réservé aux comptes connectés. Sur le site public, /partenaires/ n'existe pas.
 */
export async function middleware(requete: NextRequest) {
  const { pathname } = requete.nextUrl;
  // Espace admin pas encore construit (Sprint 9) : jamais une copie du site public sur ce sous-domaine.
  if (estHoteAdmin(requete.headers.get("host"))) return NextResponse.rewrite(new URL("/introuvable/", requete.url));
  if (!estHoteEspace(requete.headers.get("host"))) {
    if (pathname === PREFIXE_ESPACE || pathname.startsWith(`${PREFIXE_ESPACE}/`))
      return NextResponse.rewrite(new URL("/introuvable/", requete.url));
    return NextResponse.next();
  }

  const cible = requete.nextUrl.clone();
  cible.pathname = `${PREFIXE_ESPACE}${pathname}`;
  let reponse = NextResponse.rewrite(cible);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => requete.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => requete.cookies.set(name, value));
          reponse = NextResponse.rewrite(cible, { request: requete });
          cookies.forEach(({ name, value, options }) => reponse.cookies.set(name, value, options));
        },
      },
    },
  );
  // getUser (et non getSession) : le jeton est vérifié auprès de Supabase, pas seulement lu dans le cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publique = PAGES_PUBLIQUES_ESPACE.some((p) => pathname === p || pathname === p.slice(0, -1));
  const redirection = (chemin: string) => {
    const r = NextResponse.redirect(new URL(chemin, requete.url));
    reponse.cookies.getAll().forEach((c) => r.cookies.set(c));
    return r;
  };
  if (!user && !publique) return redirection("/connexion/");
  if (user && (pathname === "/" || pathname === "/connexion/" || pathname === "/inscription/"))
    return redirection("/dashboard/");
  if (!user && pathname === "/") return redirection("/connexion/");
  return reponse;
}

export const config = {
  // Ni les fichiers statiques ni les images optimisées : ils ne dépendent pas de l'hôte.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|svg|ico|txt|xml)$).*)"],
};
