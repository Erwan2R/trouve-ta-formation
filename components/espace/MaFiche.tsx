"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, useTransition } from "react";
import type { Retour } from "@/lib/supabase/queries/apres-enregistrement";
import { LANGUES, PLAFOND_PRESENTATION } from "@/lib/organismes/validation";
import { FINANCEMENTS, monogramme } from "@/lib/organismes/libelles";
import { ChampAdresse } from "./ChampAdresse";
import type * as Actions from "@/app/partenaires/(connecte)/ma-fiche/actions";

export type DonneesMaFiche = {
  emailCompte: string;
  identite: {
    nom: string;
    raison_sociale: string;
    siret: string;
    numero_declaration_activite: string;
    annee_creation: string;
  };
  logo: string | null;
  agrement: { numero_agrement_cnaps: string; qualiopi: boolean; numero_qualiopi: string };
  coordonnees: {
    adresse: string;
    code_postal: string;
    ville: string;
    telephone: string;
    site_web: string;
    email_contact: string;
    horaires: string;
  };
  lieux: (Actions.LieuSaisi & { formations: string[] })[];
  pratique: { financements: string[]; accessibilite_pmr: boolean; langues: string[] };
  presentation: { presentation: string };
};

type ActionsMaFiche = {
  [
    K in
      | "enregistrerIdentite"
      | "enregistrerAgrement"
      | "enregistrerCoordonnees"
      | "enregistrerLieux"
      | "enregistrerPratique"
      | "enregistrerPresentation"
      | "deposerLogo"
      | "retirerLogo"
      | "chercherSiret"
  ]: (typeof Actions)[K];
};

const SECTIONS = [
  ["identite", "01", "Identité"],
  ["logo", "02", "Logo"],
  ["agrement", "03", "Agrément et certifications"],
  ["coordonnees", "04", "Coordonnées et siège"],
  ["lieux", "05", "Lieux additionnels"],
  ["pratique", "06", "Informations pratiques"],
  ["presentation", "07", "Présentation"],
] as const;
type Cle = (typeof SECTIONS)[number][0];

const champ =
  "w-full rounded-[14px] border border-line bg-cream-100 px-[15px] py-[13px] text-[15px] text-ink-900 outline-none focus:border-ink-900 focus:bg-white";
const mono = "font-mono text-[14.5px] tracking-[0.04em]";
const libelle = "text-[13.5px] font-bold";

/** Une section : valeurs locales, état « modifié », enregistrement séparé (UX Ma fiche §2). */
/**
 * Affichage de la fiche : toutes les sections (Ma fiche) ou une partie avec enregistrement automatique
 * (onboarding, spec Inscription §7 : « sauvegarde automatique à chaque étape »).
 */
export type ModeFiche = { sections: Cle[] | null; auto: boolean };
const Mode = createContext<ModeFiche>({ sections: null, auto: false });

function useSection<T>(
  initial: T,
  cle: Cle,
  signaler: (c: Cle, sale: boolean) => void,
  action: (v: T) => Promise<Retour>,
) {
  const router = useRouter();
  const { auto } = useContext(Mode);
  const [valeurs, setValeurs] = useState(initial);
  const [enregistre, setEnregistre] = useState(initial);
  const [statut, setStatut] = useState<{ heure?: string; erreur?: string }>({});
  const [enCours, demarrer] = useTransition();
  const sale = JSON.stringify(valeurs) !== JSON.stringify(enregistre);
  const maj = (v: T) => {
    setValeurs(v);
    setStatut({});
    signaler(cle, JSON.stringify(v) !== JSON.stringify(enregistre));
  };
  const enregistrer = () =>
    demarrer(async () => {
      const r = await action(valeurs);
      if (!r.ok) return setStatut({ erreur: r.erreur });
      setEnregistre(valeurs);
      setStatut({ heure: r.heure });
      signaler(cle, false);
      router.refresh(); // statut « En ligne » de l'en-tête, compteurs
    });
  const annuler = () => {
    setValeurs(enregistre);
    setStatut({});
    signaler(cle, false);
  };
  // Enregistrement automatique : 900 ms après la dernière frappe, et au départ de l'étape si besoin.
  const dernier = useRef({ valeurs, sale });
  dernier.current = { valeurs, sale };
  useEffect(() => {
    if (!auto || !sale) return;
    const t = setTimeout(enregistrer, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- relancé à chaque modification des valeurs
  }, [auto, valeurs]);
  useEffect(
    () => () => {
      if (auto && dernier.current.sale) void action(dernier.current.valeurs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- au démontage seulement
    [],
  );
  return { valeurs, maj, sale, statut, enCours, enregistrer, annuler, setStatut };
}

function Section({
  id,
  num,
  titre,
  description,
  pied,
  children,
}: {
  id: string;
  num: string;
  titre: string;
  description?: string;
  pied: React.ReactNode;
  children: React.ReactNode;
}) {
  const { sections, auto } = useContext(Mode);
  if (sections && !sections.includes(id as Cle)) return null;
  return (
    <section
      id={id}
      className="flex scroll-mt-[100px] flex-col gap-[22px] rounded-[28px] border border-line bg-white p-[clamp(22px,3vw,34px)]"
    >
      <div className="flex flex-col gap-1.5">
        {!auto && <span className="font-mono text-[11px] text-brique-700">{num}</span>}
        {/* Étape à section unique : la page porte déjà ce titre. */}
        <h2
          className={`text-2xl leading-[1.15] font-extrabold tracking-[-0.025em] ${sections?.length === 1 ? "sr-only" : ""}`}
        >
          {titre}
        </h2>
        {description && <p className="text-[14.5px] leading-[1.6] text-ink-500">{description}</p>}
      </div>
      {children}
      {pied}
    </section>
  );
}

function Pied({
  s,
  onSave,
  gauche,
}: {
  s: { sale: boolean; statut: { heure?: string; erreur?: string }; enCours: boolean; annuler: () => void };
  onSave: () => void;
  gauche?: React.ReactNode;
}) {
  const { auto } = useContext(Mode);
  const texte =
    s.statut.erreur ??
    (s.sale
      ? auto
        ? "Enregistrement…"
        : "Modifications non enregistrées"
      : s.statut.heure
        ? `Enregistré à ${s.statut.heure}`
        : "");
  const rouge = !!s.statut.erreur || s.sale;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-[18px]">
      <span className="flex items-center gap-3.5">
        <span
          role="status"
          className={`flex items-center gap-2 text-[13px] ${rouge ? "text-brique-700" : "text-ink-600"} ${s.statut.erreur ? "font-bold" : ""}`}
        >
          {texte && (
            <span
              aria-hidden="true"
              className={`block size-[7px] rounded-full ${rouge ? "bg-brique-700" : "bg-ink-900"}`}
            />
          )}
          {texte}
        </span>
        {gauche}
      </span>
      <span className={`flex gap-2 ${auto ? "hidden" : ""}`}>
        {s.sale && (
          <button
            type="button"
            onClick={s.annuler}
            className="cursor-pointer rounded-full border border-line-strong bg-white px-[18px] py-3 text-sm font-bold text-ink-900 hover:border-ink-900"
          >
            Annuler
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={!s.sale || s.enCours}
          className="cursor-pointer rounded-full bg-ink-900 px-5 py-[13px] text-sm font-bold text-white hover:bg-brique-700 disabled:cursor-default disabled:bg-line disabled:text-ink-400"
        >
          {s.enCours ? "Enregistrement…" : "Enregistrer"}
        </button>
      </span>
    </div>
  );
}

function Bascule({
  choix,
  valeur,
  onChange,
  libelleGroupe,
}: {
  choix: [string, boolean][];
  valeur: boolean;
  onChange: (v: boolean) => void;
  libelleGroupe: string;
}) {
  return (
    <span
      role="radiogroup"
      aria-label={libelleGroupe}
      className="flex gap-[3px] self-start rounded-full border border-line bg-cream-100 p-1"
    >
      {choix.map(([texte, v]) => (
        <button
          key={texte}
          type="button"
          role="radio"
          aria-checked={valeur === v}
          onClick={() => onChange(v)}
          className={`cursor-pointer rounded-full px-4 py-2.5 text-sm font-bold ${valeur === v ? "bg-ink-900 text-white" : "text-ink-700"}`}
        >
          {texte}
        </button>
      ))}
    </span>
  );
}

export function MaFiche({
  donnees: d,
  actions: a,
  mode = { sections: null, auto: false },
}: {
  donnees: DonneesMaFiche;
  actions: ActionsMaFiche;
  mode?: ModeFiche;
}) {
  return (
    <Mode.Provider value={mode}>
      <Formulaire donnees={d} actions={a} />
    </Mode.Provider>
  );
}

function Formulaire({ donnees: d, actions: a }: { donnees: DonneesMaFiche; actions: ActionsMaFiche }) {
  const { sections } = useContext(Mode);
  const [sales, setSales] = useState<Partial<Record<Cle, boolean>>>({});
  const signaler = (c: Cle, sale: boolean) => setSales((s) => ({ ...s, [c]: sale }));

  const identite = useSection(d.identite, "identite", signaler, a.enregistrerIdentite);
  const agrement = useSection(d.agrement, "agrement", signaler, a.enregistrerAgrement);
  const coord = useSection(d.coordonnees, "coordonnees", signaler, a.enregistrerCoordonnees);
  const lieux = useSection(d.lieux, "lieux", signaler, (l) =>
    a.enregistrerLieux(l.map(({ formations: _f, ...x }) => ({ ...x, id: x.id !== null && x.id < 0 ? null : x.id }))),
  );
  const pratique = useSection(d.pratique, "pratique", signaler, a.enregistrerPratique);
  const pres = useSection(d.presentation, "presentation", signaler, a.enregistrerPresentation);

  // Logo : envoi immédiat du fichier choisi (conversion WebP côté serveur).
  const [logo, setLogo] = useState(d.logo);
  const [logoStatut, setLogoStatut] = useState<{ heure?: string; erreur?: string }>({});
  const [logoEnCours, demarrerLogo] = useTransition();
  const [survol, setSurvol] = useState(false);
  const fichierRef = useRef<HTMLInputElement>(null);
  const envoyerLogo = (f: File | undefined) => {
    if (!f) return;
    if (!/^image\/(png|jpeg)$/.test(f.type))
      return setLogoStatut({ erreur: "Ce format n'est pas accepté. Choisissez un fichier JPG ou PNG." });
    if (f.size > 2 * 1024 * 1024) return setLogoStatut({ erreur: "Ce fichier dépasse 2 Mo." });
    const fd = new FormData();
    fd.set("logo", f);
    demarrerLogo(async () => {
      const r = await a.deposerLogo(fd);
      if (!r.ok) return setLogoStatut({ erreur: r.erreur });
      setLogo(URL.createObjectURL(f));
      setLogoStatut({ heure: r.heure });
    });
  };

  // SIRET : propositions à reprendre champ par champ (« Vos champs ne sont remplacés que si vous le choisissez »).
  const [sirene, setSirene] = useState<Actions.DonneesSirene | null>(null);
  const [sireneEnCours, demarrerSirene] = useTransition();
  const siretComplet = identite.valeurs.siret.replace(/\s/g, "").length === 14;

  const iv = identite.valeurs;
  const cv = coord.valeurs;
  const memeEmail =
    cv.email_contact.trim().toLowerCase() === d.emailCompte.toLowerCase() && cv.email_contact.trim() !== "";
  const nbCar = pres.valeurs.presentation.length;
  const proche = nbCar > PLAFOND_PRESENTATION * 0.9;
  const [confirmer, setConfirmer] = useState<number | null>(null);
  const nouvelId = useRef(-1);

  return (
    <div className="flex flex-wrap items-start gap-3.5">
      <aside
        hidden={!!sections}
        className="sticky top-24 flex max-w-full flex-[1_1_220px] flex-col gap-0.5 rounded-3xl border border-line bg-white px-2.5 py-4"
      >
        <span className="px-3 pt-1 pb-2.5 font-mono text-[10px] tracking-[0.14em] text-ink-300 uppercase">
          Sections
        </span>
        {SECTIONS.map(([cle, num, titre]) => (
          <a
            key={cle}
            href={`#${cle}`}
            className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-ink-900 hover:bg-cream-100 hover:text-ink-900"
          >
            <span className="flex-none font-mono text-[11px] text-brique-700">{num}</span>
            <span className="flex-1 text-sm font-semibold">{titre}</span>
            {sales[cle] && (
              <span
                title="Modifications non enregistrées"
                className="block size-[7px] flex-none rounded-full bg-brique-700"
              />
            )}
          </a>
        ))}
      </aside>

      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-3.5">
        <Section
          id="identite"
          num="01"
          titre="Identité"
          description="Les informations légales de votre organisme."
          pied={<Pied s={identite} onSave={identite.enregistrer} />}
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
            <label className="col-span-full flex flex-col gap-[7px]">
              <span className={libelle}>Nom de l&apos;organisme</span>
              <input className={champ} value={iv.nom} onChange={(e) => identite.maj({ ...iv, nom: e.target.value })} />
            </label>
            <label className="col-span-full flex flex-col gap-[7px]">
              <span className={libelle}>Raison sociale</span>
              <input
                className={champ}
                value={iv.raison_sociale}
                onChange={(e) => identite.maj({ ...iv, raison_sociale: e.target.value })}
              />
            </label>
            <div className="flex flex-col gap-[7px]">
              <span className="flex items-baseline justify-between gap-2.5">
                <label htmlFor="siret" className={libelle}>
                  SIRET
                </label>
                <button
                  type="button"
                  disabled={!siretComplet || sireneEnCours}
                  onClick={() =>
                    demarrerSirene(async () => {
                      const r = await a.chercherSiret(iv.siret);
                      if (r.ok) setSirene(r.donnees);
                      else identite.setStatut({ erreur: r.erreur });
                    })
                  }
                  className="cursor-pointer text-[13px] font-bold text-brique-700 hover:text-ink-900 disabled:cursor-default disabled:text-ink-200"
                >
                  {sireneEnCours ? "Recherche…" : "Pré-remplir depuis le SIRET"}
                </button>
              </span>
              <input
                id="siret"
                inputMode="numeric"
                placeholder="14 chiffres"
                className={`${champ} ${mono}`}
                value={iv.siret}
                onChange={(e) => identite.maj({ ...iv, siret: e.target.value })}
              />
            </div>
            <label className="flex flex-col gap-[7px]">
              <span className={libelle}>Numéro de déclaration d&apos;activité</span>
              <input
                className={`${champ} ${mono}`}
                value={iv.numero_declaration_activite}
                onChange={(e) => identite.maj({ ...iv, numero_declaration_activite: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-[7px]">
              <span className={libelle}>Année de création</span>
              <input
                inputMode="numeric"
                className={`${champ} ${mono}`}
                value={iv.annee_creation}
                onChange={(e) => identite.maj({ ...iv, annee_creation: e.target.value })}
              />
            </label>
          </div>
          {sirene && (
            <div className="flex flex-col gap-3 rounded-[20px] border border-line-strong bg-cream-100 px-5 py-[18px]">
              <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
                <span className="text-[15px] font-bold">Données trouvées pour ce SIRET</span>
                <button
                  type="button"
                  onClick={() => setSirene(null)}
                  className="cursor-pointer text-[13px] font-semibold text-ink-500 hover:text-ink-900"
                >
                  Fermer
                </button>
              </span>
              <span className="text-[13.5px] leading-[1.55] text-ink-500">
                Vos champs ne sont remplacés que si vous le choisissez.
              </span>
              <div className="flex flex-col border-t border-line-strong">
                {[
                  {
                    etiquette: "Raison sociale",
                    trouve: sirene.raison_sociale,
                    actuel: iv.raison_sociale,
                    identique: iv.raison_sociale.trim().toLowerCase() === sirene.raison_sociale.toLowerCase(),
                    utiliser: () => identite.maj({ ...iv, raison_sociale: sirene.raison_sociale }),
                  },
                  {
                    etiquette: "Adresse du siège",
                    trouve: `${sirene.adresse}, ${sirene.code_postal} ${sirene.ville}`,
                    actuel: cv.adresse ? `${cv.adresse}, ${cv.code_postal} ${cv.ville}` : "",
                    identique:
                      `${cv.adresse}${cv.code_postal}${cv.ville}`.toLowerCase() ===
                      `${sirene.adresse}${sirene.code_postal}${sirene.ville}`.toLowerCase(),
                    utiliser: () =>
                      coord.maj({
                        ...cv,
                        adresse: sirene.adresse,
                        code_postal: sirene.code_postal,
                        ville: sirene.ville,
                      }),
                  },
                ].map((r) => (
                  <div
                    key={r.etiquette}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-b border-line-strong py-3"
                  >
                    <span className="flex min-w-0 flex-[1_1_280px] flex-col gap-[3px]">
                      <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase">
                        {r.etiquette}
                      </span>
                      <span className="text-[14.5px] font-bold">{r.trouve}</span>
                      <span className="text-[13px] text-ink-500">
                        {r.actuel ? `Actuellement : ${r.actuel}` : "Champ vide"}
                      </span>
                    </span>
                    {r.identique ? (
                      <span className="flex-none font-mono text-[10.5px] tracking-[0.1em] text-ink-600 uppercase">
                        Identique
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={r.utiliser}
                        className="flex-none cursor-pointer rounded-full bg-ink-900 px-[15px] py-2.5 text-[13px] font-bold text-white hover:bg-brique-700"
                      >
                        Utiliser
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        <Section
          id="logo"
          num="02"
          titre="Logo"
          description="Il apparaît sur votre fiche et sur votre carte dans le catalogue."
          pied={
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-[18px]">
              <span className="flex items-center gap-3.5">
                <span
                  role="status"
                  className={`flex items-center gap-2 text-[13px] ${logoStatut.erreur ? "font-bold text-brique-700" : "text-ink-600"}`}
                >
                  {logoStatut.erreur ??
                    (logoEnCours ? "Envoi en cours…" : logoStatut.heure ? `Enregistré à ${logoStatut.heure}` : "")}
                </span>
                {logo && (
                  <button
                    type="button"
                    onClick={() =>
                      demarrerLogo(async () => {
                        const r = await a.retirerLogo();
                        if (!r.ok) return setLogoStatut({ erreur: r.erreur });
                        setLogo(null);
                        setLogoStatut({ heure: r.heure });
                      })
                    }
                    className="cursor-pointer text-[13px] font-bold text-brique-700 hover:text-ink-900"
                  >
                    Retirer le logo
                  </button>
                )}
              </span>
            </div>
          }
        >
          <div className="flex flex-wrap items-stretch gap-4">
            <div className="flex flex-none flex-col items-center gap-2.5">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- aperçu local ou logo déjà converti en WebP
                <img
                  src={logo}
                  alt="Logo actuel"
                  width={148}
                  height={148}
                  className="block size-[148px] rounded-3xl border border-line bg-white object-contain"
                />
              ) : (
                <span className="flex size-[148px] flex-col items-center justify-center gap-2.5 rounded-3xl border border-line bg-[repeating-linear-gradient(135deg,#ECE8E2_0_7px,#F7F5F1_7px_14px)]">
                  <span className="flex size-[54px] items-center justify-center rounded-[14px] border border-line bg-white font-mono text-[15px] text-ink-600">
                    {monogramme(iv.nom || "Organisme")}
                  </span>
                  <span className="rounded-full bg-white px-[9px] py-[3px] font-mono text-[10px] tracking-[0.08em] text-ink-500 uppercase">
                    Aucun logo
                  </span>
                </span>
              )}
              <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase">Aperçu</span>
            </div>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setSurvol(true);
              }}
              onDragLeave={() => setSurvol(false)}
              onDrop={(e) => {
                e.preventDefault();
                setSurvol(false);
                envoyerLogo(e.dataTransfer.files[0]);
              }}
              className={`relative flex min-w-0 flex-[1_1_300px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-3xl border-[1.5px] border-dashed p-6 text-center hover:border-brique-700 hover:bg-brique-050 ${survol ? "border-brique-700 bg-brique-050" : "border-line-heavy bg-cream-100"}`}
            >
              <input
                ref={fichierRef}
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={(e) => envoyerLogo(e.target.files?.[0])}
              />
              <span className="text-base font-bold">
                {survol ? "Déposez le fichier ici" : logo ? "Remplacer le logo" : "Glissez votre logo ici"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-[13.5px] font-bold text-white">
                Choisir un fichier
              </span>
              <span className="text-[13px] leading-[1.55] text-ink-500">
                JPG ou PNG, 2 Mo maximum. Format carré recommandé.
              </span>
            </label>
          </div>
        </Section>

        <Section
          id="agrement"
          num="03"
          titre="Agrément et certifications"
          pied={<Pied s={agrement} onSave={agrement.enregistrer} />}
        >
          <div className="flex flex-wrap items-stretch gap-4">
            <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
              <label className="flex flex-col gap-[7px]">
                <span className={libelle}>Numéro d&apos;agrément CNAPS</span>
                <input
                  placeholder="FOR-093-2029-00-00-00000000000"
                  className={`${champ} font-mono text-[14.5px] tracking-[0.02em]`}
                  value={agrement.valeurs.numero_agrement_cnaps}
                  onChange={(e) => agrement.maj({ ...agrement.valeurs, numero_agrement_cnaps: e.target.value })}
                />
              </label>
              <div className="flex flex-col gap-[9px]">
                <span className={libelle}>Qualiopi</span>
                <Bascule
                  libelleGroupe="Qualiopi"
                  choix={[
                    ["Certifié", true],
                    ["Non certifié", false],
                  ]}
                  valeur={agrement.valeurs.qualiopi}
                  onChange={(v) => agrement.maj({ ...agrement.valeurs, qualiopi: v })}
                />
              </div>
              {agrement.valeurs.qualiopi && (
                <label className="flex flex-col gap-[7px]">
                  <span className={libelle}>Numéro de certificat Qualiopi</span>
                  <input
                    className={`${champ} ${mono}`}
                    value={agrement.valeurs.numero_qualiopi}
                    onChange={(e) => agrement.maj({ ...agrement.valeurs, numero_qualiopi: e.target.value })}
                  />
                </label>
              )}
            </div>
            <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-3 rounded-[22px] bg-ink-900 p-[22px]">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-400 uppercase">
                Sur votre fiche publique
              </span>
              <span className="text-[16.5px] leading-[1.4] font-bold text-white">
                L&apos;agrément CNAPS est le signal de confiance le plus fort de votre fiche.
              </span>
              <span className="text-sm leading-[1.6] text-on-dark">
                Tant qu&apos;il n&apos;est pas renseigné, votre fiche affiche « agrément non renseigné ». Vous pouvez le
                compléter ici à tout moment.
              </span>
              <span className="mt-auto flex flex-wrap gap-1.5 border-t border-line-dark pt-3.5">
                {agrement.valeurs.numero_agrement_cnaps.trim() ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-[11px] py-[5px] text-xs font-semibold text-ink-900">
                    <span aria-hidden="true" className="block size-[5px] rounded-full bg-brique-700" />
                    Agréé CNAPS
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border-[1.5px] border-dashed border-ink-300 px-[11px] py-1 text-xs font-semibold text-on-dark">
                    Agrément non renseigné
                  </span>
                )}
                {agrement.valeurs.qualiopi && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-line-dark px-[11px] py-[5px] text-xs font-semibold text-white">
                    <span aria-hidden="true" className="block size-[5px] rounded-full bg-brique-400" />
                    Qualiopi
                  </span>
                )}
              </span>
            </div>
          </div>
        </Section>

        <Section
          id="coordonnees"
          num="04"
          titre="Coordonnées et siège"
          description="Ce que les candidats utilisent pour vous trouver et vous joindre."
          pied={<Pied s={coord} onSave={coord.enregistrer} />}
        >
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-6 flex flex-col gap-[7px]">
              <span aria-hidden="true" className={libelle}>
                Adresse du siège
              </span>
              <ChampAdresse
                libelle="Adresse du siège"
                className={champ}
                valeur={cv.adresse}
                onChange={(v) => coord.maj({ ...cv, adresse: v })}
                onChoix={(adr) => coord.maj({ ...cv, ...adr })}
              />
            </div>
            <label className="col-span-6 flex min-w-0 flex-col gap-[7px] sm:col-span-2">
              <span className={libelle}>Code postal</span>
              <input
                inputMode="numeric"
                autoComplete="postal-code"
                className={`${champ} ${mono}`}
                value={cv.code_postal}
                onChange={(e) => coord.maj({ ...cv, code_postal: e.target.value })}
              />
            </label>
            <label className="col-span-6 flex min-w-0 flex-col gap-[7px] sm:col-span-4">
              <span className={libelle}>Ville</span>
              <input className={champ} value={cv.ville} onChange={(e) => coord.maj({ ...cv, ville: e.target.value })} />
            </label>
            <label className="col-span-6 flex min-w-0 flex-col gap-[7px] sm:col-span-3">
              <span className={libelle}>Téléphone</span>
              <input
                type="tel"
                className={`${champ} ${mono}`}
                value={cv.telephone}
                onChange={(e) => coord.maj({ ...cv, telephone: e.target.value })}
              />
            </label>
            <label className="col-span-6 flex min-w-0 flex-col gap-[7px] sm:col-span-3">
              <span className={libelle}>Site web</span>
              <input
                type="url"
                placeholder="https://"
                className={champ}
                value={cv.site_web}
                onChange={(e) => coord.maj({ ...cv, site_web: e.target.value })}
              />
            </label>
            <div className="col-span-6 flex flex-col gap-[7px]">
              <label htmlFor="email-public" className={libelle}>
                Email de contact public
              </label>
              <input
                id="email-public"
                type="email"
                className={champ}
                value={cv.email_contact}
                onChange={(e) => coord.maj({ ...cv, email_contact: e.target.value })}
                aria-describedby="email-public-aide"
              />
              <span
                id="email-public-aide"
                className={`text-[13px] leading-[1.55] ${memeEmail ? "text-brique-700" : "text-ink-500"}`}
              >
                {memeEmail
                  ? "Attention : c'est l'adresse de connexion à votre espace. Elle sera visible par tous sur votre fiche."
                  : `Cette adresse est affichée sur votre fiche publique. Elle peut être différente de l'email de connexion à votre espace (${d.emailCompte}).`}
              </span>
            </div>
            <label className="col-span-6 flex flex-col gap-[7px]">
              <span className={libelle}>Horaires d&apos;accueil</span>
              <input
                placeholder="Du lundi au vendredi, de 9 h à 18 h"
                className={champ}
                value={cv.horaires}
                onChange={(e) => coord.maj({ ...cv, horaires: e.target.value })}
              />
            </label>
          </div>
        </Section>

        <Section
          id="lieux"
          num="05"
          titre="Lieux additionnels"
          description="Les lieux où vous formez, en plus du siège. Vous pourrez y rattacher vos formations."
          pied={<Pied s={lieux} onSave={lieux.enregistrer} />}
        >
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-[18px] border border-line px-[18px] py-3.5">
              <span className="flex-none rounded-full bg-ink-900 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-white uppercase">
                Siège
              </span>
              <span className="min-w-0 flex-[1_1_240px] text-[14.5px] text-ink-700">
                {d.coordonnees.adresse
                  ? `${d.coordonnees.adresse}, ${d.coordonnees.code_postal} ${d.coordonnees.ville}`
                  : "Adresse du siège non renseignée"}
              </span>
              <a href="#coordonnees" className="text-[13px] font-bold">
                Modifier dans Coordonnées
              </a>
            </div>
            {lieux.valeurs.map((l, i) => {
              const n = l.formations.length;
              const maj = (patch: Partial<typeof l>) =>
                lieux.maj(lieux.valeurs.map((x, j) => (j === i ? { ...x, ...patch } : x)));
              const retirer = () => {
                setConfirmer(null);
                lieux.maj(lieux.valeurs.filter((_, j) => j !== i));
              };
              const confirme = confirmer === l.id;
              return (
                <div
                  key={l.id ?? i}
                  className={`flex flex-col gap-3 rounded-[18px] border bg-cream-100 px-[18px] py-4 ${confirme ? "border-brique-200" : "border-line"}`}
                >
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] items-end gap-3">
                    <label className="flex flex-col gap-[7px]">
                      <span className="text-[13px] font-bold">Nom du lieu</span>
                      <input
                        placeholder="Antenne Créteil"
                        className={`${champ} bg-white`}
                        value={l.nom}
                        onChange={(e) => maj({ nom: e.target.value })}
                      />
                    </label>
                    <div className="flex flex-col gap-[7px] sm:col-span-2">
                      <span aria-hidden="true" className="text-[13px] font-bold">
                        Adresse
                      </span>
                      <ChampAdresse
                        libelle="Adresse"
                        className={`${champ} bg-white`}
                        valeur={l.adresse}
                        onChange={(v) => maj({ adresse: v })}
                        onChoix={(adr) => maj(adr)}
                      />
                    </div>
                    <label className="flex flex-col gap-[7px]">
                      <span className="text-[13px] font-bold">Code postal</span>
                      <input
                        inputMode="numeric"
                        className={`${champ} ${mono} bg-white`}
                        value={l.code_postal}
                        onChange={(e) => maj({ code_postal: e.target.value })}
                      />
                    </label>
                    <label className="flex flex-col gap-[7px]">
                      <span className="text-[13px] font-bold">Ville</span>
                      <input
                        className={`${champ} bg-white`}
                        value={l.ville}
                        onChange={(e) => maj({ ville: e.target.value })}
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <span className="font-mono text-[11px] text-ink-500">
                      {n === 0
                        ? "Aucune formation rattachée"
                        : `${n} formation${n > 1 ? "s" : ""} rattachée${n > 1 ? "s" : ""} : ${l.formations.join(" · ")}`}
                    </span>
                    {!confirme && (
                      <button
                        type="button"
                        onClick={() => (n === 0 ? retirer() : setConfirmer(l.id))}
                        className="cursor-pointer py-1 text-[13px] font-bold text-brique-700 hover:text-ink-900"
                      >
                        Supprimer ce lieu
                      </button>
                    )}
                  </div>
                  {confirme && (
                    <div className="flex flex-col gap-3 rounded-[14px] border border-brique-200 bg-white px-4 py-3.5">
                      <span className="text-sm leading-[1.6]">
                        {n === 1 ? "1 formation est rattachée" : `${n} formations sont rattachées`} à ce lieu :{" "}
                        {l.formations.join(", ")}. Si vous le supprimez,{" "}
                        {n === 1 ? "elle sera rattachée" : "elles seront rattachées"} au siège.
                      </span>
                      <span className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={retirer}
                          className="cursor-pointer rounded-full bg-brique-700 px-4 py-2.5 text-[13.5px] font-bold text-white hover:bg-ink-900"
                        >
                          Supprimer quand même
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmer(null)}
                          className="cursor-pointer rounded-full border border-line-strong bg-white px-4 py-2.5 text-[13.5px] font-bold hover:border-ink-900"
                        >
                          Garder ce lieu
                        </button>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            {lieux.valeurs.length === 0 && (
              <div className="flex justify-center rounded-[18px] border-[1.5px] border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,#F2EFE9_0_7px,#FFFFFF_7px_14px)] p-[18px]">
                <span className="rounded-full bg-white px-3 py-1 text-sm text-ink-500">
                  Vous formez uniquement au siège pour l&apos;instant.
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                lieux.maj([
                  ...lieux.valeurs,
                  { id: nouvelId.current--, nom: "", adresse: "", code_postal: "", ville: "", formations: [] },
                ])
              }
              className="inline-flex cursor-pointer items-center gap-2.5 self-start rounded-full border border-ink-900 bg-white px-[18px] py-3 text-sm font-bold hover:bg-cream-100"
            >
              <span aria-hidden="true" className="text-base leading-none text-brique-700">
                +
              </span>
              Ajouter un lieu
            </button>
          </div>
        </Section>

        <Section
          id="pratique"
          num="06"
          titre="Informations pratiques"
          description="Des informations qui valent pour toute votre fiche, siège et lieux additionnels."
          pied={<Pied s={pratique} onSave={pratique.enregistrer} />}
        >
          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <div className="flex w-full flex-col gap-[9px]">
              <span className={libelle}>Financements acceptés</span>
              <span className="text-[13px] text-ink-500">
                Ces informations permettent aux candidats de vous trouver. Vous pouvez aussi les préciser formation par
                formation.
              </span>
              <span className="flex flex-wrap gap-2">
                {Object.entries(FINANCEMENTS).map(([cle, texte]) => {
                  const actif = pratique.valeurs.financements.includes(cle);
                  return (
                    <button
                      key={cle}
                      type="button"
                      aria-pressed={actif}
                      onClick={() =>
                        pratique.maj({
                          ...pratique.valeurs,
                          financements: actif
                            ? pratique.valeurs.financements.filter((x) => x !== cle)
                            : [...pratique.valeurs.financements, cle],
                        })
                      }
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-[15px] py-[9px] text-sm font-semibold hover:border-ink-900 ${actif ? "border-ink-900 bg-ink-900 text-white" : "border-line bg-white text-ink-700"}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`block size-1.5 rounded-full ${actif ? "bg-brique-400" : "bg-line-heavy"}`}
                      />
                      {texte}
                    </button>
                  );
                })}
              </span>
            </div>
            <div className="flex flex-col gap-[9px]">
              <span className={libelle}>Accès adapté aux personnes à mobilité réduite</span>
              <Bascule
                libelleGroupe="Accès adapté aux personnes à mobilité réduite"
                choix={[
                  ["Oui", true],
                  ["Non", false],
                ]}
                valeur={pratique.valeurs.accessibilite_pmr}
                onChange={(v) => pratique.maj({ ...pratique.valeurs, accessibilite_pmr: v })}
              />
            </div>
            <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-[9px]">
              <span className={libelle}>Autres langues parlées par l&apos;équipe</span>
              <span className="text-[13px] text-ink-500">
                Les formations et les examens se déroulent en français. Indiquez les autres langues dans lesquelles
                votre équipe peut accueillir et renseigner les candidats.
              </span>
              <span className="flex flex-wrap gap-2">
                {LANGUES.map((lg) => {
                  const actif = pratique.valeurs.langues.includes(lg);
                  return (
                    <button
                      key={lg}
                      type="button"
                      aria-pressed={actif}
                      onClick={() =>
                        pratique.maj({
                          ...pratique.valeurs,
                          langues: actif
                            ? pratique.valeurs.langues.filter((x) => x !== lg)
                            : [...pratique.valeurs.langues, lg],
                        })
                      }
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-[15px] py-[9px] text-sm font-semibold hover:border-ink-900 ${actif ? "border-ink-900 bg-ink-900 text-white" : "border-line bg-white text-ink-700"}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`block size-1.5 rounded-full ${actif ? "bg-brique-400" : "bg-line-heavy"}`}
                      />
                      {lg}
                    </button>
                  );
                })}
              </span>
            </div>
          </div>
        </Section>

        <Section
          id="presentation"
          num="07"
          titre="Présentation"
          description="Quelques lignes sur votre centre, vos publics et votre façon de former."
          pied={<Pied s={pres} onSave={pres.enregistrer} />}
        >
          <div className="flex flex-col gap-2">
            <textarea
              rows={7}
              maxLength={PLAFOND_PRESENTATION}
              aria-label="Présentation"
              className="min-h-[170px] w-full resize-y rounded-[18px] border border-line bg-cream-100 px-[18px] py-4 text-[15.5px] leading-[1.65] outline-none focus:border-ink-900 focus:bg-white"
              value={pres.valeurs.presentation}
              onChange={(e) => pres.maj({ presentation: e.target.value })}
            />
            <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
              <span className="text-[13px] leading-[1.55] text-ink-500">
                Si ce champ reste vide, le bloc Présentation n&apos;apparaît pas sur votre fiche.
              </span>
              <span className="flex items-center gap-2.5">
                <span className="block h-1 w-[120px] overflow-hidden rounded-full bg-line">
                  <span
                    className={`block h-full ${proche ? "bg-brique-700" : "bg-ink-600"}`}
                    style={{ width: `${Math.min(100, (nbCar / PLAFOND_PRESENTATION) * 100)}%` }}
                  />
                </span>
                <span className={`font-mono text-xs ${proche ? "text-brique-700" : "text-ink-600"}`}>
                  {nbCar} / {PLAFOND_PRESENTATION}
                </span>
              </span>
            </span>
          </div>
        </Section>
      </div>
    </div>
  );
}
