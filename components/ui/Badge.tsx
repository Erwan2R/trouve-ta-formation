/** Badge de statut (README §6.6) : actif = filet noir plein + point brique ; inactif = pointillés gris. */
export function Badge({ actif, children }: { actif: boolean; children: React.ReactNode }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border-[1.5px] py-1 pr-[11px] pl-[9px] text-[12.5px] font-bold",
        actif ? "border-ink-900 text-ink-900" : "border-dashed border-ink-200 bg-cream-100 text-ink-600",
      ].join(" ")}
    >
      <span aria-hidden="true" className={`size-[7px] rounded-full ${actif ? "bg-brique-700" : "bg-ink-200"}`} />
      {children}
    </span>
  );
}
