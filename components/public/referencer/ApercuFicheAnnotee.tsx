"use client";

import { useState } from "react";

type Annotation = { titre: string; texte: string };

const zone = (actif: boolean) =>
  `rounded-[14px] border border-line bg-white p-[18px] outline-2 outline-offset-[3px] transition-[outline-color] ${actif ? "outline-brique-700" : "outline-transparent"}`;
const etiquette = "font-mono text-[10px] tracking-[0.12em] text-ink-400 uppercase";

function Pastille({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-6 flex-none items-center justify-center rounded-full bg-brique-700 font-mono text-xs text-white"
    >
      {n}
    </span>
  );
}

/**
 * Bloc 5 de la landing : une fiche complète (exemple) et ses six annotations. Survoler ou toucher une annotation
 * met en évidence la zone correspondante. Tout le texte est rendu côté serveur ; l'interaction est décorative.
 */
export function ApercuFicheAnnotee({ annotations, mention }: { annotations: Annotation[]; mention: string }) {
  const [actif, setActif] = useState(1);
  const survol = (n: number) => ({ onMouseEnter: () => setActif(n) });
  return (
    <div className="flex flex-wrap items-start gap-[clamp(20px,3.5vw,48px)]">
      <figure
        aria-label="Exemple de fiche organisme complète"
        className="m-0 flex min-w-[290px] flex-[1.25_1_460px] flex-col gap-3 rounded-[26px] border border-line-strong bg-cream-100 p-[clamp(16px,2.4vw,28px)]"
      >
        <span aria-hidden="true" className="flex items-center gap-2 px-1 pb-1 font-mono text-[10.5px] text-ink-400">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block size-[7px] rounded-full bg-line-heavy" />
          ))}
          <span className="ml-2">trouve-ta-formation.fr/organismes/votre-centre-de-formation</span>
        </span>

        <div {...survol(1)} className={`${zone(actif === 1)} flex flex-wrap items-start gap-3.5`}>
          <span className="flex size-[52px] flex-none items-center justify-center rounded-xl border border-line bg-cream-200 font-mono text-sm text-ink-600">
            VC
          </span>
          <span className="flex min-w-[140px] flex-[1_1_160px] flex-col gap-[7px]">
            <span className="text-lg leading-[1.2] font-bold tracking-[-0.02em]">Votre centre de formation</span>
            <span className="flex flex-wrap gap-[5px]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-2.5 py-1 text-[11.5px] font-semibold text-white">
                <span className="block size-[5px] rounded-full bg-brique-400" />
                Agréé CNAPS
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-2.5 py-1 text-[11.5px] font-semibold text-ink-600">
                <span className="block size-[5px] rounded-full bg-brique-700" />
                Qualiopi
              </span>
            </span>
          </span>
          <Pastille n={1} />
        </div>

        <div {...survol(2)} className={`${zone(actif === 2)} flex flex-col gap-2.5`}>
          <span className="flex items-center justify-between gap-3">
            <span className={etiquette}>Formations proposées</span>
            <Pastille n={2} />
          </span>
          {[
            ["TFP APS", "175 h · temps plein · 1 490 €"],
            ["SSIAP 1", "70 h · temps plein · 690 €"],
            ["MAC APS", "31 h · week-end · 390 €"],
          ].map(([t, d], i) => (
            <span
              key={t}
              className={`flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5 ${i < 2 ? "border-b border-cream-200 pb-[9px]" : ""}`}
            >
              <span className="text-[15px] font-bold">{t}</span>
              <span className="font-mono text-xs text-ink-500">{d}</span>
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            [3, "Lieux", "Bobigny · Saint-Denis · Montreuil"],
            [4, "Financements", "CPF · France Travail · OPCO"],
          ].map(([n, t, d]) => (
            <div
              key={t as string}
              {...survol(n as number)}
              className={`${zone(actif === n)} flex min-w-[150px] flex-[1_1_170px] flex-col gap-[9px]`}
            >
              <span className="flex items-center justify-between gap-2.5">
                <span className={etiquette}>{t}</span>
                <Pastille n={n as number} />
              </span>
              <span className="text-sm leading-[1.55] text-ink-700">{d}</span>
            </div>
          ))}
        </div>

        <div {...survol(5)} className={`${zone(actif === 5)} flex flex-wrap items-center gap-3`}>
          <span className="flex min-w-[160px] flex-[1_1_180px] flex-col gap-[5px]">
            <span className={etiquette}>Contact</span>
            <span className="text-[14.5px] font-semibold">01 48 30 00 00 · contact@votre-centre.fr</span>
          </span>
          <Pastille n={5} />
        </div>

        <div {...survol(6)} className={`${zone(actif === 6)} flex flex-col gap-[9px]`}>
          <span className="flex items-center justify-between gap-2.5">
            <span className={etiquette}>Présentation</span>
            <Pastille n={6} />
          </span>
          <span className="text-sm leading-[1.6] text-ink-500">
            Centre installé à Bobigny depuis 2014, spécialisé dans la formation initiale des agents de sécurité privée.
            Sessions de 12 stagiaires maximum…
          </span>
        </div>
      </figure>

      <div className="sticky top-24 flex min-w-[270px] flex-[1_1_340px] flex-col gap-[18px]">
        <ol className="flex flex-col gap-1">
          {annotations.map((a, i) => {
            const n = i + 1;
            const on = actif === n;
            return (
              <li
                key={a.titre}
                onMouseEnter={() => setActif(n)}
                onClick={() => setActif(n)}
                className={`flex cursor-pointer items-start gap-3.5 rounded-2xl px-4 py-3.5 ${on ? "bg-cream-100" : ""}`}
              >
                <span
                  className={`flex size-7 flex-none items-center justify-center rounded-full border border-line-strong font-mono text-xs ${on ? "bg-brique-700 text-white" : "bg-white text-brique-700"}`}
                >
                  {n}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-base font-bold">{a.titre}</span>
                  <span className="text-[14.5px] leading-[1.6] text-ink-500">{a.texte}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="border-t border-line px-4 pt-4 text-[14.5px] leading-[1.7] text-ink-500">{mention}</p>
      </div>
    </div>
  );
}
