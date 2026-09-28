import Image from "next/image";
import { monogramme } from "@/lib/organismes/libelles";

/** Logo de l'organisme, ou monogramme généré (jamais un placeholder générique — Copy catalogue §8.1). */
export function LogoOrganisme({
  nom,
  logo,
  taille,
  className = "",
}: {
  nom: string;
  logo: string | null;
  taille: number;
  className?: string;
}) {
  const cadre = `flex flex-none items-center justify-center overflow-hidden border border-line bg-cream-200 ${className}`;
  if (logo)
    return (
      <span className={cadre} style={{ width: taille, height: taille }}>
        <Image src={logo} alt="" width={taille} height={taille} className="size-full object-contain" />
      </span>
    );
  return (
    <span
      aria-hidden="true"
      className={`${cadre} font-mono text-ink-600`}
      style={{ width: taille, height: taille, fontSize: Math.round(taille * 0.3) }}
    >
      {monogramme(nom)}
    </span>
  );
}
