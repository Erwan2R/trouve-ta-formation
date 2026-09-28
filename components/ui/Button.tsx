import Link from "next/link";
import type { ComponentProps } from "react";

// README §6.5. Site public : 14px/600 ; espaces Log/Admin : 700 (`fort`).
const variantes = {
  primaire: "bg-ink-900 text-white hover:bg-brique-700 hover:text-white",
  accent: "bg-brique-700 text-white hover:bg-ink-900 hover:text-white",
  secondaire: "border border-line-strong bg-white text-ink-900 hover:border-ink-900 hover:text-ink-900",
} as const;

type Props = { variante?: keyof typeof variantes; fort?: boolean; className?: string };

function classes({ variante = "primaire", fort, className }: Props) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-[11px] text-sm whitespace-nowrap transition-colors",
    "disabled:cursor-not-allowed disabled:bg-line-heavy disabled:text-white",
    fort ? "font-bold" : "font-semibold",
    variantes[variante],
    className,
  ].join(" ");
}

/** Lien stylé en bouton : toujours un vrai <a href> (règle SEO §5). */
export function ButtonLink({ variante, fort, className, ...props }: Props & ComponentProps<typeof Link>) {
  return <Link {...props} className={classes({ variante, fort, className })} />;
}

export function Button({ variante, fort, className, type = "button", ...props }: Props & ComponentProps<"button">) {
  return <button type={type} {...props} className={classes({ variante, fort, className })} />;
}
