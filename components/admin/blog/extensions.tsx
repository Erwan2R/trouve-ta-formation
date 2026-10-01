"use client";

import { TableKit } from "@tiptap/extension-table";
import {
  mergeAttributes,
  Node,
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BLOG } from "@/contenu/securite-privee/blog";

// Blocs de l'éditeur (UX Blog admin §3.2 à 3.5) : exactement ceux que la page publique sait rendre
// (lib/blog/document.ts). Aucun autre bloc n'est proposé.

export const VARIANTES_CALLOUT = [
  { variante: "vigilance", libelle: "Point de vigilance", usage: "Une erreur fréquente, un piège réglementaire" },
  { variante: "chiffre", libelle: "Chiffre clé", usage: "Une donnée à isoler visuellement" },
  { variante: "renvoi", libelle: "Renvoi contextuel", usage: "Lien vers la page formation ou démarche" },
] as const;

const etiquette = "font-mono text-[10.5px] tracking-[0.12em] uppercase select-none";

function VueCallout({ node, updateAttributes }: ReactNodeViewProps) {
  const v = node.attrs.variante as string;
  const sombre = v === "chiffre";
  return (
    <NodeViewWrapper
      as="aside"
      className={`my-2.5 flex flex-col gap-2 rounded-[18px] px-[18px] py-4 ${sombre ? "bg-ink-900 text-white" : v === "renvoi" ? "border-[1.5px] border-line bg-white" : "border-l-2 border-brique-700 bg-cream-100"}`}
    >
      <span contentEditable={false} className={`${etiquette} ${sombre ? "text-brique-400" : "text-brique-700"}`}>
        {v === "vigilance" ? BLOG.article.aSavoir : v === "renvoi" ? BLOG.article.surLeMemeSujet : "Chiffre clé"}
      </span>
      {sombre && (
        <input
          contentEditable={false}
          aria-label="Chiffre mis en avant"
          placeholder="Le chiffre (ex. 1 000 mots)"
          value={(node.attrs.chiffre as string | null) ?? ""}
          onChange={(e) => updateAttributes({ chiffre: e.target.value || null })}
          className="w-full max-w-[320px] rounded-lg bg-line-dark px-3 py-2 font-mono text-[26px] tracking-[-0.03em] text-brique-400 outline-none placeholder:text-ink-300"
        />
      )}
      <NodeViewContent className={`text-base leading-[1.6] ${sombre ? "text-on-dark" : "text-ink-900"}`} />
    </NodeViewWrapper>
  );
}

const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "paragraph+",
  defining: true,
  addAttributes: () => ({ variante: { default: "vigilance" }, chiffre: { default: null } }),
  parseHTML: () => [{ tag: "aside[data-callout]" }],
  renderHTML: ({ HTMLAttributes }) => ["aside", mergeAttributes(HTMLAttributes, { "data-callout": "" }), 0],
  addNodeView: () => ReactNodeViewRenderer(VueCallout),
});

function VueImage({ node, updateAttributes, selected }: ReactNodeViewProps) {
  const a = node.attrs as { src: string; alt: string; legende: string | null };
  return (
    <NodeViewWrapper
      as="figure"
      className={`my-2.5 flex flex-col gap-2 rounded-2xl p-1 ${selected ? "outline-2 outline-ink-900" : ""}`}
    >
      {/* Aperçu dans l'éditeur : l'image publique passe par next/image (WebP dimensionné). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a.src} alt={a.alt} className="max-h-[420px] w-full rounded-2xl object-cover" />
      <div contentEditable={false} className="flex flex-col gap-2 rounded-xl bg-cream-100 p-3 text-[13px]">
        <label className="flex flex-col gap-1">
          <span className="font-bold">
            Texte alternatif <span className="text-brique-700">· obligatoire</span>
          </span>
          <input
            value={a.alt}
            onChange={(e) => updateAttributes({ alt: e.target.value })}
            className={`rounded-lg border-[1.5px] bg-white px-2.5 py-2 outline-none ${a.alt.trim() ? "border-line-strong" : "border-brique-700"}`}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-bold">
            Légende visible <span className="font-normal text-ink-400">· facultative</span>
          </span>
          <input
            value={a.legende ?? ""}
            onChange={(e) => updateAttributes({ legende: e.target.value || null })}
            className="rounded-lg border border-line-strong bg-white px-2.5 py-2 outline-none"
          />
        </label>
      </div>
    </NodeViewWrapper>
  );
}

const ImageBlog = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes: () => ({
    src: { default: "" },
    alt: { default: "" },
    legende: { default: null },
    largeur: { default: null },
    hauteur: { default: null },
  }),
  parseHTML: () => [{ tag: "figure[data-image]" }],
  renderHTML: ({ HTMLAttributes }) => [
    "figure",
    mergeAttributes({ "data-image": "" }),
    ["img", { src: HTMLAttributes.src, alt: HTMLAttributes.alt }],
  ],
  addNodeView: () => ReactNodeViewRenderer(VueImage),
});

export const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    italic: false,
    strike: false,
    underline: false,
    code: false,
    codeBlock: false,
    blockquote: false,
    horizontalRule: false,
    // Liens : posés depuis la fenêtre « Lien » (page du site choisie dans une liste, ou adresse https).
    link: { openOnClick: false, autolink: false, linkOnPaste: false, HTMLAttributes: { rel: null, target: null } },
  }),
  TableKit.configure({ table: { resizable: false } }),
  Callout,
  ImageBlog,
];
