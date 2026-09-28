import "server-only";
import { headers } from "next/headers";

/** Origine de l'espace pour les liens envoyés par email (https://partenaires-dev…, http://partenaires.localhost:3000). */
export async function origineEspace(): Promise<string> {
  const h = await headers();
  const hote = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (hote?.includes("localhost") ? "http" : "https");
  return `${proto}://${hote}`;
}
