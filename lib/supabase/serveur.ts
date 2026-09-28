import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Client authentifié de l'espace organisme (session en cookies, rafraîchie par le middleware).
 * Soumis aux policies RLS du propriétaire : un compte ne lit et n'écrit que sa propre fiche.
 */
export async function supabaseServeur() {
  const magasin = await cookies();
  return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => magasin.getAll(),
      setAll: (aPoser) => {
        try {
          aPoser.forEach(({ name, value, options }) => magasin.set(name, value, options));
        } catch {
          // Appel depuis un composant serveur : le middleware se charge du rafraîchissement.
        }
      },
    },
  });
}

/** Client service role : suppression de compte uniquement (auth.admin). Jamais exposé au client. */
export function supabaseAdmin() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
