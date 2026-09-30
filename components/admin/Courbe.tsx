"use client";

import { useId, useState } from "react";

type Serie = { nom: string; valeurs: number[]; couleur: string };

const fr = (n: number) => Math.round(n).toLocaleString("fr-FR");
const arrondiHaut = (v: number) => {
  const p = 10 ** Math.floor(Math.log10(Math.max(v, 1)));
  return Math.ceil(v / p) * p;
};

/**
 * Courbe de la maquette « Analytics Admin » : ligne sur aire claire, ou aires empilées (paliers ; « hachures » =
 * motif du palier Basique). Survol : repère vertical et valeurs du point.
 */
export function Courbe({
  series,
  libelles,
  empile = false,
  sombre = false,
  hauteur = 180,
}: {
  series: Serie[];
  libelles: string[];
  empile?: boolean;
  sombre?: boolean;
  hauteur?: number;
}) {
  const id = useId().replace(/:/g, "");
  const [survol, setSurvol] = useState<number | null>(null);
  const W = 600;
  const H = hauteur;
  const n = libelles.length;
  const totaux = libelles.map((_, i) =>
    empile ? series.reduce((s, x) => s + x.valeurs[i], 0) : Math.max(...series.map((x) => x.valeurs[i])),
  );
  const max = arrondiHaut(Math.max(1, ...totaux) * 1.08);
  const X = (i: number) => (n === 1 ? 0 : (i * W) / (n - 1));
  const Y = (v: number) => H - (v / max) * H;
  const remplissage = (c: string) => (c === "hachures" ? `url(#h-${id})` : c);

  const formes: React.ReactNode[] = [];
  if (empile) {
    const bas = new Array(n).fill(0);
    series.forEach((s, k) => {
      const haut = s.valeurs.map((v, i) => bas[i] + v);
      const d = `M${haut.map((v, i) => `${X(i)},${Y(v)}`).join(" L")} L${bas
        .map((_, i) => `${X(n - 1 - i)},${Y(bas[n - 1 - i])}`)
        .join(" L")} Z`;
      formes.push(
        <path
          key={k}
          d={d}
          fill={remplissage(s.couleur)}
          stroke="#FFFFFF"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />,
      );
      haut.forEach((v, i) => (bas[i] = v));
    });
  } else {
    series.forEach((s, k) => {
      const pts = s.valeurs.map((v, i) => `${X(i)},${Y(v)}`).join(" L");
      if (k === 0)
        formes.push(<path key={`a${k}`} d={`M0,${H} L${pts} L${W},${H} Z`} fill={sombre ? "#1A1818" : "#F7F5F1"} />);
      formes.push(
        <path
          key={`l${k}`}
          d={`M${pts}`}
          fill="none"
          stroke={s.couleur}
          strokeWidth={2.25}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />,
      );
    });
  }

  return (
    <div className="relative cursor-crosshair">
      <span
        className={`absolute -top-0.5 left-0 pr-1.5 font-mono text-[10px] text-ink-300 ${sombre ? "bg-ink-900" : "bg-white"}`}
      >
        {fr(max)}
      </span>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        width="100%"
        height={H}
        role="img"
        aria-label={series.map((s) => `${s.nom} : ${fr(s.valeurs[n - 1] ?? 0)} en fin de période`).join(", ")}
        className="block overflow-visible"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setSurvol(Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left) / r.width) * (n - 1)))));
        }}
        onMouseLeave={() => setSurvol(null)}
      >
        <defs>
          <pattern id={`h-${id}`} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={8} height={8} fill="#F7F5F1" />
            <rect width={4} height={8} fill="#E7E3DD" />
          </pattern>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={0}
            x2={W}
            y1={H * g}
            y2={H * g}
            stroke={sombre ? "#2A2626" : "#F0ECE6"}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {formes}
        {survol !== null && (
          <line
            x1={X(survol)}
            x2={X(survol)}
            y1={0}
            y2={H}
            stroke={sombre ? "#E19D8B" : "#A83B2A"}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {survol !== null && (
        <div
          className={`pointer-events-none absolute top-1.5 z-[2] flex min-w-[130px] flex-col gap-1 rounded-xl bg-ink-900 px-3 py-[9px] text-white ${sombre ? "border border-line-dark" : ""}`}
          style={{
            left: `${(survol / Math.max(1, n - 1)) * 100}%`,
            transform: `translateX(${survol > n * 0.7 ? "-105%" : survol < n * 0.3 ? "5%" : "-50%"})`,
          }}
        >
          <span className="font-mono text-[10.5px] tracking-[0.08em] text-brique-400 uppercase">
            {libelles[survol]}
          </span>
          {series.map((s) => (
            <span key={s.nom} className="flex justify-between gap-3.5 text-[12.5px]">
              <span className="text-on-dark">{s.nom}</span>
              <span className="font-mono">{fr(s.valeurs[survol])}</span>
            </span>
          ))}
        </div>
      )}
      <div className={`mt-2 flex justify-between font-mono text-[10.5px] ${sombre ? "text-ink-300" : "text-ink-400"}`}>
        <span>{libelles[0]}</span>
        <span>{libelles[Math.floor((n - 1) / 2)]}</span>
        <span>{libelles[n - 1]}</span>
      </div>
    </div>
  );
}
