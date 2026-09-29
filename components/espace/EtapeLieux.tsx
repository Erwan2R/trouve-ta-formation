"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ONBOARDING as O } from "@/contenu/espace/onboarding";

/** Étape 4 : question unique, franchissable en un clic ; « Oui » ouvre l'ajout de lieux (spec Inscription §6). */
export function EtapeLieux({ dejaMultiSite, children }: { dejaMultiSite: boolean; children: React.ReactNode }) {
  const [oui, setOui] = useState(dejaMultiSite);
  const router = useRouter();
  if (oui) return <>{children}</>;
  const choix = "cursor-pointer rounded-full px-6 py-4 text-[15px] font-bold";
  return (
    <section className="flex flex-col gap-5 rounded-[28px] border border-line bg-white p-[clamp(22px,3vw,34px)]">
      <h2 className="text-2xl leading-[1.15] font-extrabold tracking-[-0.025em]">{O.lieuxQuestion}</h2>
      <span className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setOui(true)}
          className={`${choix} border border-ink-900 bg-white text-ink-900 hover:bg-cream-100`}
        >
          {O.lieuxOui}
        </button>
        <button
          type="button"
          onClick={() => router.push("/bienvenue/5/")}
          className={`${choix} bg-ink-900 text-white hover:bg-brique-700`}
        >
          {O.lieuxNon}
        </button>
      </span>
    </section>
  );
}
