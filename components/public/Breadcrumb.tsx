import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";

export type Miette = { name: string; path: string };

/** Fil d'Ariane visible + BreadcrumbList. Le dernier élément est la page courante (non cliquable). */
export function Breadcrumb({ items }: { items: Miette[] }) {
  const courant = items.at(-1);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Fil d'Ariane">
        <ol className="flex flex-wrap items-center gap-2 text-[12.5px] text-ink-400">
          {items.slice(0, -1).map((m) => (
            <li key={m.path} className="flex items-center gap-2">
              <Link href={m.path} className="text-ink-400 hover:text-ink-900">
                {m.name}
              </Link>
              <span aria-hidden="true">›</span>
            </li>
          ))}
          {courant && (
            <li aria-current="page" className="truncate text-ink-600">
              {courant.name}
            </li>
          )}
        </ol>
      </nav>
    </>
  );
}
