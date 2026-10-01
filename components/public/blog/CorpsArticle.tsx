import Image from "next/image";
import Link from "next/link";
import { BLOG } from "@/contenu/securite-privee/blog";
import { ancres, type Marque, type Noeud } from "@/lib/blog/document";
import { fr } from "@/lib/typo";

const h2 = "scroll-mt-40 text-[clamp(25px,3vw,34px)] leading-[1.1] font-bold tracking-[-0.025em] text-balance";
const h3 = "scroll-mt-40 text-[19px] leading-[1.3] font-bold tracking-[-0.015em]";
const prose = "text-[17px] leading-[1.75] text-pretty text-ink-700";
const filet = "border-[#DFD9D2]";
const surtitre = "font-mono text-[10.5px] tracking-[0.12em] uppercase";

type Contexte = { visibles: Set<string>; ids: Map<Noeud, string> };

/**
 * Lien du corps : externe (lien sortant sourcé, rel="noopener") ou interne. Un lien interne vers une page absente
 * de cet environnement s'affiche en texte simple : jamais de lien vers une 404.
 */
function Lien({ href, ctx, children }: { href: string; ctx: Contexte; children: React.ReactNode }) {
  if (/^https?:\/\//.test(href))
    return (
      <a href={href} rel="noopener" className="font-semibold underline decoration-line-heavy underline-offset-[3px]">
        {children}
      </a>
    );
  if (!ctx.visibles.has(href)) return <>{children}</>;
  return (
    <Link href={href} className="font-semibold underline decoration-line-heavy underline-offset-[3px]">
      {children}
    </Link>
  );
}

function Texte({ n, ctx }: { n: Extract<Noeud, { type: "text" }>; ctx: Contexte }) {
  let rendu: React.ReactNode = fr(n.text);
  // Gras et italique d'abord, le lien en dernier : il enveloppe toujours le texte mis en forme.
  const marques = [...(n.marks ?? [])].sort((a, b) => Number(a.type === "link") - Number(b.type === "link"));
  for (const m of marques as Marque[]) {
    if (m.type === "bold") rendu = <strong className="font-semibold text-ink-900">{rendu}</strong>;
    else if (m.type === "italic") rendu = <em>{rendu}</em>;
    else if (m.type === "link")
      rendu = (
        <Lien href={m.attrs.href} ctx={ctx}>
          {rendu}
        </Lien>
      );
  }
  return <>{rendu}</>;
}

function Enfants({ n, ctx }: { n: Noeud; ctx: Contexte }) {
  const enfants = "content" in n ? (n.content ?? []) : [];
  return (
    <>
      {enfants.map((e, i) => (
        <Bloc key={i} n={e} ctx={ctx} />
      ))}
    </>
  );
}

function Bloc({ n, ctx }: { n: Noeud; ctx: Contexte }): React.ReactNode {
  switch (n.type) {
    case "text":
      return <Texte n={n} ctx={ctx} />;
    case "hardBreak":
      return <br />;
    case "paragraph":
      return (
        <p className={prose}>
          <Enfants n={n} ctx={ctx} />
        </p>
      );
    case "heading":
      return n.attrs.level === 2 ? (
        <h2 id={ctx.ids.get(n)} className={`${h2} mt-4`}>
          <Enfants n={n} ctx={ctx} />
        </h2>
      ) : (
        <h3 id={ctx.ids.get(n)} className={`${h3} mt-2`}>
          <Enfants n={n} ctx={ctx} />
        </h3>
      );
    case "bulletList":
    case "orderedList": {
      const Liste = n.type === "bulletList" ? "ul" : "ol";
      return (
        <Liste
          className={`flex flex-col gap-2 pl-6 ${prose} ${n.type === "bulletList" ? "list-disc marker:text-brique-700" : "list-decimal marker:font-mono marker:text-[14px] marker:text-brique-700"} [&_p]:text-[17px]`}
        >
          <Enfants n={n} ctx={ctx} />
        </Liste>
      );
    }
    case "listItem":
      return (
        <li className="pl-1 [&>p]:inline">
          <Enfants n={n} ctx={ctx} />
        </li>
      );
    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <tbody>
              <Enfants n={n} ctx={ctx} />
            </tbody>
          </table>
        </div>
      );
    case "tableRow":
      return (
        <tr>
          <Enfants n={n} ctx={ctx} />
        </tr>
      );
    case "tableHeader":
      return (
        <th
          scope="col"
          className={`border-b border-line-heavy pr-4 pb-2.5 align-bottom ${surtitre} font-medium text-ink-400 [&_p]:font-mono [&_p]:text-[10.5px] [&_p]:leading-snug [&_p]:text-ink-400`}
        >
          <Enfants n={n} ctx={ctx} />
        </th>
      );
    case "tableCell":
      return (
        <td className={`border-b ${filet} py-3 pr-4 align-top [&_p]:text-base [&_p]:leading-[1.55]`}>
          <Enfants n={n} ctx={ctx} />
        </td>
      );
    case "image":
      return (
        <figure className="flex flex-col gap-2.5">
          <Image
            src={n.attrs.src}
            alt={n.attrs.alt}
            width={n.attrs.largeur ?? 1200}
            height={n.attrs.hauteur ?? 675}
            sizes="(min-width: 900px) 720px, 100vw"
            className="h-auto w-full rounded-[18px] border border-line"
          />
          {n.attrs.legende && (
            <figcaption className="text-[13.5px] leading-[1.55] text-ink-400">{fr(n.attrs.legende)}</figcaption>
          )}
        </figure>
      );
    case "callout":
      return <Callout n={n} ctx={ctx} />;
    default:
      return null;
  }
}

/** Call-outs (Copy §5) : « À savoir », chiffre clé sans libellé, « Sur le même sujet ». Texte dans le DOM au chargement. */
function Callout({ n, ctx }: { n: Extract<Noeud, { type: "callout" }>; ctx: Contexte }) {
  if (n.attrs.variante === "chiffre")
    return (
      <aside className="flex flex-wrap items-baseline gap-x-5 gap-y-2 rounded-[22px] bg-ink-900 px-[clamp(20px,3vw,30px)] py-6 text-white [&_p]:text-[16.5px] [&_p]:text-on-dark">
        {n.attrs.chiffre && (
          <span className="font-mono text-[clamp(36px,5vw,52px)] leading-none tracking-[-0.04em] text-brique-400">
            {fr(n.attrs.chiffre)}
          </span>
        )}
        <div className="flex min-w-[min(100%,240px)] flex-1 flex-col gap-2">
          <Enfants n={n} ctx={ctx} />
        </div>
      </aside>
    );
  if (n.attrs.variante === "renvoi")
    return (
      <aside className="flex flex-col gap-2 rounded-[20px] border border-line bg-white p-[22px] [&_a]:font-bold [&_p]:text-base">
        <span className={`${surtitre} text-brique-700`}>{BLOG.article.surLeMemeSujet}</span>
        <Enfants n={n} ctx={ctx} />
      </aside>
    );
  return (
    <aside className="flex flex-col gap-1.5 border-l-2 border-brique-700 py-1 pl-5 [&_p]:text-ink-900">
      <span className={`${surtitre} text-brique-700`}>{BLOG.article.aSavoir}</span>
      <Enfants n={n} ctx={ctx} />
    </aside>
  );
}

/** Corps d'un article (UX blog §4 bloc 5) : rendu serveur, ancres des intertitres en dur. */
export function CorpsArticle({ doc, visibles }: { doc: Noeud; visibles: Set<string> }) {
  const titres = ("content" in doc ? (doc.content ?? []) : []).filter((x) => x.type === "heading");
  const ids = new Map<Noeud, string>(ancres(doc).map((a, i) => [titres[i], a.id]));
  return (
    <div className="flex flex-col gap-[22px]">
      <Enfants n={doc} ctx={{ visibles, ids }} />
    </div>
  );
}
