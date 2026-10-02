import Link from "next/link";
import type { Verticale } from "@/lib/config/verticales";
import { EMAIL_CONTACT } from "@/lib/config/contact";
import { URL_ESPACE_ORGANISME } from "@/lib/espace";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getDepartements, getTitresParCategorie } from "@/lib/supabase/queries/referentiel";
import { Logo } from "./Logo";

const lien = "text-[14.5px] text-on-dark-strong hover:text-white";
const inactif = "text-[14.5px] text-ink-200";
const suite = "mt-1 text-[14.5px] text-brique-400 hover:text-white";

function Colonne({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="eyebrow text-brique-400">{titre}</span>
      {children}
    </div>
  );
}

/** Seul endroit où un lien inter-verticale est toléré (ligne « Voir tous les secteurs »). */
export async function SiteFooter({ verticale }: { verticale: Verticale }) {
  const [groupes, departements, { demarches, listeVisible }] = await Promise.all([
    getTitresParCategorie(),
    getDepartements(),
    getDemarches(verticale),
  ]);
  const titres = new Map(groupes.flatMap((g) => g.titres).map((t) => [t.slug, t]));
  const depts = new Map(departements.map((d) => [d.code, d]));
  const base = `/${verticale.slug}/`;

  return (
    <footer className="bg-ink-900 pt-[72px] pb-8 text-on-dark">
      <div className="container-public">
        <Logo height={30} inverse />
        <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-9">
          <Colonne titre="Formations les plus recherchées">
            {verticale.footerTitres.map(({ slug, libelle }) => {
              const t = titres.get(slug);
              if (!t) return null;
              const label = libelle ?? t.libelle_court;
              return t.a_une_page ? (
                <Link key={slug} href={`${base}${slug}/`} className={lien}>
                  {label}
                </Link>
              ) : (
                <span key={slug} className={inactif}>
                  {label}
                </span>
              );
            })}
            <Link href={base} className={suite}>
              Toutes les formations →
            </Link>
          </Colonne>

          <Colonne titre="Se former par département">
            {verticale.footerDepartements.map((code) => {
              const d = depts.get(code);
              if (!d) return null;
              const label = `${d.nom} (${d.code})`;
              return d.a_une_page ? (
                <Link key={code} href={`${base}${d.slug}/`} className={lien}>
                  {label}
                </Link>
              ) : (
                <span key={code} className={inactif}>
                  {label}
                </span>
              );
            })}
          </Colonne>

          <Colonne titre="Démarches CNAPS">
            {demarches.map((d) =>
              d.a_une_page ? (
                <Link key={d.slug} href={`${base}demarches/${d.slug}/`} className={lien}>
                  {d.libelle}
                </Link>
              ) : (
                <span key={d.slug} className={inactif}>
                  {d.libelle}
                </span>
              ),
            )}
            {listeVisible && (
              <Link href={`${base}demarches/`} className={suite}>
                Toutes les démarches →
              </Link>
            )}
          </Colonne>

          <Colonne titre="Trouve ta formation">
            <Link href="/a-propos/" className={lien}>
              À propos
            </Link>
            <Link href="/methode-de-referencement/" className={lien}>
              Notre méthode de référencement
            </Link>
            <Link href={`${base}blog/`} className={lien}>
              Blog
            </Link>
            <a href={`mailto:${EMAIL_CONTACT}`} className={lien}>
              Contact
            </a>
            <a href={`${URL_ESPACE_ORGANISME}/`} className={lien}>
              Espace organisme
            </a>
            <span className="mt-1 flex flex-wrap gap-2.5 text-[13px]">
              <Link href="/mentions-legales/" className="text-ink-300 hover:text-white">
                Mentions légales
              </Link>
              <Link href="/confidentialite/" className="text-ink-300 hover:text-white">
                Politique de confidentialité
              </Link>
              <Link href="/conditions-utilisation/" className="text-ink-300 hover:text-white">
                Conditions d&apos;utilisation
              </Link>
              <Link href="/cookies/" className="text-ink-300 hover:text-white">
                Gestion des cookies
              </Link>
            </span>
          </Colonne>
        </div>

        <p className="mt-12 border-t border-line-dark pt-6 text-sm leading-relaxed text-ink-300">
          Trouve ta formation référence aussi des organismes dans d&apos;autres secteurs.{" "}
          <Link href="/" className="font-semibold text-on-dark-strong hover:text-white">
            Voir tous les secteurs →
          </Link>
        </p>
        <p className="mt-4 text-[12.5px] leading-relaxed text-ink-300">
          © 2026 Trouve ta formation — Annuaire indépendant des organismes de formation. Les informations réglementaires
          sont fournies à titre indicatif ; seuls les textes en vigueur et le CNAPS font foi.
        </p>
      </div>
    </footer>
  );
}
