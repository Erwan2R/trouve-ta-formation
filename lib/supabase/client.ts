import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Client anonyme sans cookies : compatible SSG/ISR, soumis aux policies RLS de lecture publique.
// Le client authentifié (espaces organisme/admin) arrive au Sprint 8.
export function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY manquantes (voir .env.example)");
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}
