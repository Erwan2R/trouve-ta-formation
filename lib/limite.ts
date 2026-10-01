import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { supabaseAdmin } from "./supabase/serveur";

/**
 * Limitation des tentatives (audit sécurité, 1er octobre 2026). Les appels à Supabase partent du serveur : sa propre
 * limite par IP ne protège pas chaque compte. Clés en empreinte SHA-256 (jamais l'email ni l'IP en clair), purgées
 * après 24 h (purger_donnees).
 */
export type Regle = { cle: string; max: number; minutes: number };

const empreinte = (s: string) => createHash("sha256").update(s.trim().toLowerCase()).digest("hex").slice(0, 40);

/** Adresse IP du visiteur (première adresse de x-forwarded-for, posée par Vercel). */
export async function ipVisiteur(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "inconnue";
}

/** Règles d'une action : par compte (email ou identifiant) et par adresse IP. */
export function regles(
  action: string,
  compte: string | null,
  ip: string,
  parCompte: number,
  parIp: number,
  minutes = 15,
): Regle[] {
  return [
    ...(compte ? [{ cle: `${action}:c:${empreinte(compte)}`, max: parCompte, minutes }] : []),
    { cle: `${action}:ip:${empreinte(ip)}`, max: parIp, minutes },
  ];
}

/** Vrai si l'une des règles est atteinte : l'action doit être refusée sans être tentée. */
export async function limiteAtteinte(rs: Regle[]): Promise<boolean> {
  const admin = supabaseAdmin();
  for (const r of rs) {
    const depuis = new Date(Date.now() - r.minutes * 60_000).toISOString();
    const { count } = await admin
      .from("tentatives_acces")
      .select("id", { count: "exact", head: true })
      .eq("cle", r.cle)
      .gte("created_at", depuis);
    if ((count ?? 0) >= r.max) return true;
  }
  return false;
}

/** Enregistre une tentative (échouée, ou envoi d'email). */
export async function noterTentative(rs: Regle[]): Promise<void> {
  await supabaseAdmin()
    .from("tentatives_acces")
    .insert(rs.map((r) => ({ cle: r.cle })));
}

/** Après un succès : le compteur du compte repart de zéro (celui de l'IP reste, contre les essais en masse). */
export async function effacerTentatives(rs: Regle[]): Promise<void> {
  const compte = rs.filter((r) => r.cle.includes(":c:")).map((r) => r.cle);
  if (compte.length) await supabaseAdmin().from("tentatives_acces").delete().in("cle", compte);
}

export const MESSAGE_LIMITE = "Trop de tentatives. Réessayez dans 15 minutes.";
