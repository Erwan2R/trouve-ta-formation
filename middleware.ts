import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";
import { lireSessionAdmin, redirectionAdmin } from "@/lib/admin-acces";
import { estHoteAdmin, estHoteEspace, PAGES_PUBLIQUES_ESPACE, PREFIXE_ADMIN, PREFIXE_ESPACE } from "@/lib/espace";

/**
 * Sous-domaines partenaires. et admin. → pages de app/partenaires/ et app/admin/, avec rafraîchissement de la
 * session Supabase et accès réservé. Sur le site public, /partenaires/ et /admin/ n'existent pas.
 */
export async function middleware(requete: NextRequest) {
  const { pathname } = requete.nextUrl;
  const hote = requete.headers.get("host");
  const admin = estHoteAdmin(hote);
  if (!admin && !estHoteEspace(hote)) {
    if ([PREFIXE_ESPACE, PREFIXE_ADMIN].some((p) => pathname === p || pathname.startsWith(`${p}/`)))
      return NextResponse.rewrite(new URL("/introuvable/", requete.url));
    return NextResponse.next();
  }

  const cible = requete.nextUrl.clone();
  cible.pathname = `${admin ? PREFIXE_ADMIN : PREFIXE_ESPACE}${pathname}`;
  let reponse = NextResponse.rewrite(cible);

  const supabase = createServerClient<Database>(
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

  const redirection = (chemin: string) => {
    const r = NextResponse.redirect(new URL(chemin, requete.url));
    reponse.cookies.getAll().forEach((c) => r.cookies.set(c));
    return r;
  };

  if (admin) {
    const { etat } = await lireSessionAdmin(supabase, user);
    // Compte non administrateur ou session de plus de 8 heures : déconnexion avant de revenir à la connexion.
    if (etat === "refuse" || etat === "expire") await supabase.auth.signOut();
    const vers = redirectionAdmin(etat, pathname);
    return vers ? redirection(vers) : reponse;
  }

  const publique = PAGES_PUBLIQUES_ESPACE.some((p) => pathname === p || pathname === p.slice(0, -1));
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
