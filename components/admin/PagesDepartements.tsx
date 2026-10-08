"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Retour } from "@/lib/supabase/queries/apres-enregistrement";

type Ligne = { slug: string; nom: string; code: string; mots: number; valide: boolean; url: string };

/**
 * Paramètres admin, section 05 : validation du bloc 7 des pages départements (décision Erwan du 08/10/2026).
 * En production, une page est publiée si le seuil d'organismes est atteint ET son bloc 7 est validé ici.
 * Le nombre de mots n'est qu'indicatif (objectif de la Copy géo : 300).
 */
export function PagesDepartements({
  lignes,
  valider,
}: {
  lignes: Ligne[];
  valider: (slug: string, valide: boolean) => Promise<Retour>;
}) {
  const router = useRouter();
  const [erreur, setErreur] = useState("");
  const [enCours, demarrer] = useTransition();
  // État affiché immédiatement, puis confirmé par le serveur (retour arrière en cas d’"+"échec).
  const [valides, setValides] = useState(() => new Map(lignes.map((l) => [l.slug, l.valide])));
  const basculer = (l: Ligne) => {
    const nouveau = !valides.get(l.slug);
    setValides(new Map(valides).set(l.slug, nouveau));
    demarrer(async () => {
      const r = await valider(l.slug, nouveau);
      if (!r.ok) {
        setValides((v) => new Map(v).set(l.slug, !nouveau));
        return setErreur(r.erreur);
      }
      setErreur("");
      router.refresh();
    });
  };

  return (
    <section className="flex flex-col gap-5 rounded-[28px] border border-line bg-white p-[clamp(22px,3vw,34px)]">
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] text-brique-700">05</span>
        <h2 className="text-2xl leading-[1.15] font-extrabold tracking-[-0.025em]">Pages départements</h2>
      </div>
      <p className="-mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.6] text-ink-500">
        En ligne, une page département n&apos;existe que si le seuil d&apos;organismes est atteint et que son texte « Se
        former… » est validé ici. Le nombre de mots est indicatif : l&apos;objectif est de 300.
      </p>
      {erreur && (
        <p role="alert" className="text-sm font-bold text-brique-700">
          {erreur}
        </p>
      )}
      <ul className="flex flex-col border-t border-line">
        {lignes.map((l) => (
          <li
            key={l.slug}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line py-3.5"
          >
            <span className="flex min-w-0 flex-[1_1_220px] flex-col gap-0.5">
              <a href={l.url} target="_blank" rel="noreferrer" className="text-base font-bold hover:text-brique-700">
                {l.nom} ({l.code})
              </a>
              <span className={`font-mono text-[12px] ${l.mots >= 300 ? "text-ink-500" : "text-brique-700"}`}>
                {l.mots} mots / 300
              </span>
            </span>
            <label className="flex cursor-pointer items-center gap-2.5 text-[14.5px] font-bold">
              <input
                type="checkbox"
                checked={valides.get(l.slug) ?? false}
                disabled={enCours}
                onChange={() => basculer(l)}
                className="size-[18px] accent-ink-900"
              />
              Bloc 7 validé
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
