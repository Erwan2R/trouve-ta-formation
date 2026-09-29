"use client";

import { useEffect, useId, useRef, useState } from "react";

export type AdresseChoisie = { adresse: string; code_postal: string; ville: string };
type Suggestion = AdresseChoisie & { libelle: string };
const numero = (s: string) =>
  s
    .trim()
    .match(/^\d+\s*(bis|ter)?\b/i)?.[0]
    .replace(/\s+/g, " ")
    .trim() ?? null;

/**
 * Adresse avec autocomplétion (Géoplateforme de l'IGN, service public et gratuit qui remplace l'API Adresse).
 * Choisir une suggestion remplit aussi le code postal et la ville. Saisie libre toujours possible.
 */
export function ChampAdresse({
  valeur,
  onChange,
  onChoix,
  className,
  libelle,
}: {
  valeur: string;
  onChange: (v: string) => void;
  onChoix: (a: AdresseChoisie) => void;
  className: string;
  libelle: string;
}) {
  const id = useId();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [actif, setActif] = useState(-1);
  const [ouvert, setOuvert] = useState(false);
  const saisie = useRef(false);

  useEffect(() => {
    if (!saisie.current || valeur.trim().length < 4) return setSuggestions([]);
    const controle = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(
          // lat/lon de Paris : les résultats franciliens passent devant (périmètre de l'annuaire).
          `https://data.geopf.fr/geocodage/search?index=address&autocomplete=1&limit=5&lat=48.8566&lon=2.3522&q=${encodeURIComponent(valeur)}`,
          { signal: controle.signal },
        );
        const d = await r.json();
        setSuggestions(
          (d.features ?? []).map((f: { properties: Record<string, string> }) => ({
            // Rue choisie sans numéro : on garde le numéro déjà tapé (« 8 » + « Boulevard Anatole France »).
            adresse:
              f.properties.type === "street" && numero(valeur)
                ? `${numero(valeur)} ${f.properties.name}`
                : f.properties.name,
            code_postal: f.properties.postcode,
            ville: f.properties.city,
            libelle: f.properties.label,
          })),
        );
        setActif(-1);
        setOuvert(true);
      } catch {
        // Service indisponible : la saisie libre continue de fonctionner.
      }
    }, 250);
    return () => (clearTimeout(t), controle.abort());
  }, [valeur]);

  const choisir = (s: Suggestion) => {
    saisie.current = false;
    onChoix(s);
    setOuvert(false);
    setSuggestions([]);
  };
  const visible = ouvert && suggestions.length > 0;

  return (
    <div className="relative">
      <input
        role="combobox"
        aria-label={libelle}
        aria-expanded={visible}
        aria-controls={`${id}-liste`}
        aria-autocomplete="list"
        aria-activedescendant={actif >= 0 ? `${id}-${actif}` : undefined}
        autoComplete="off"
        className={className}
        value={valeur}
        onChange={(e) => {
          saisie.current = true;
          onChange(e.target.value);
        }}
        onBlur={() => setTimeout(() => setOuvert(false), 150)}
        onKeyDown={(e) => {
          if (!visible) return;
          const n = suggestions.length;
          if (e.key === "Escape") return setOuvert(false);
          if (e.key === "Enter" && actif >= 0) choisir(suggestions[actif]);
          else if (e.key === "ArrowDown") setActif((actif + 1) % n);
          else if (e.key === "ArrowUp") setActif((actif - 1 + n) % n);
          else return;
          e.preventDefault();
        }}
      />
      {visible && (
        <ul
          id={`${id}-liste`}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_24px_60px_-24px_rgba(11,11,11,0.22)]"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.libelle}
              id={`${id}-${i}`}
              role="option"
              aria-selected={i === actif}
              onMouseDown={(e) => (e.preventDefault(), choisir(s))}
              className={`cursor-pointer px-4 py-2.5 text-sm ${i === actif ? "bg-cream-200" : "hover:bg-cream-100"}`}
            >
              {s.libelle}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
