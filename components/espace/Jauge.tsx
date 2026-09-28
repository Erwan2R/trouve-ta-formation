/** Jauge en demi-cercle de 15 segments, 5 par palier (maquette Dashboard). `rang` : 0 Basique, 1 Correct, 2 Optimal. */
export function Jauge({ rang }: { rang: number }) {
  const n = 15;
  const [cx, cy, r1, r2] = [160, 160, 96, 146];
  return (
    <svg viewBox="0 0 320 176" width="100%" className="block" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const a = Math.PI - (i * Math.PI) / (n - 1);
        const palier = Math.floor(i / 5);
        const couleur = palier < rang ? "#FFFFFF" : palier === rang ? "#E19D8B" : "#2A2626";
        return (
          <line
            key={i}
            x1={cx + r1 * Math.cos(a)}
            y1={cy - r1 * Math.sin(a)}
            x2={cx + r2 * Math.cos(a)}
            y2={cy - r2 * Math.sin(a)}
            stroke={couleur}
            strokeWidth={20}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
