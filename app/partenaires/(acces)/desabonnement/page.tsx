import type { Metadata } from "next";
import { EMAIL_CONTACT } from "@/lib/config/contact";
import { lireJetonDesabonnement } from "@/lib/desabonnement";
import { supabaseAdmin } from "@/lib/supabase/serveur";

export const metadata: Metadata = { title: "Rappels" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ t?: string; fait?: string }> };

// Lien « Ne plus recevoir ces rappels » des emails de rappel. Textes rédigés par Claude, à valider par Erwan.
// Un bouton (et non le simple clic sur le lien) : les antivirus des messageries ouvrent les liens des emails, ce qui
// désabonnerait les organismes à leur insu. Le désabonnement « en un clic » depuis la messagerie passe par
// l'en-tête List-Unsubscribe, sans même ouvrir cette page.
export default async function Desabonnement({ searchParams }: Props) {
  const { t, fait } = await searchParams;
  const id = lireJetonDesabonnement(t ?? null);
  const { data: o } = id
    ? await supabaseAdmin().from("organismes").select("nom, rappels_desabonne_le").eq("id", id).maybeSingle()
    : { data: null };
  const titre = "text-[clamp(28px,3.4vw,38px)] leading-[1.05] font-extrabold tracking-[-0.035em]";
  const texte = "text-[15px] leading-[1.6] text-ink-600";
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">Rappels par email</span>
        <h1 className={titre}>{o?.rappels_desabonne_le || fait ? "C'est noté" : "Ne plus recevoir ces rappels"}</h1>
      </div>
      {!o ? (
        <p className={texte}>
          Ce lien n&apos;est pas valable. Pour ne plus recevoir nos rappels, écrivez-nous à {EMAIL_CONTACT}.
        </p>
      ) : o.rappels_desabonne_le || fait ? (
        <p className={texte}>
          {o.nom} ne recevra plus nos rappels pour compléter sa fiche. Les emails liés à votre compte (connexion,
          changement d&apos;adresse, réponse à vos demandes) continuent de vous parvenir.
        </p>
      ) : (
        <>
          <p className={texte}>
            Nous ne vous enverrons plus de rappels pour compléter la fiche de {o.nom}. Votre fiche n&apos;est pas
            modifiée.
          </p>
          <form method="post" action={`/desabonnement/confirmer/?t=${encodeURIComponent(t!)}`}>
            <button
              type="submit"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-ink-900 px-6 py-4 text-[15.5px] font-bold text-white hover:bg-brique-700"
            >
              Ne plus recevoir ces rappels
            </button>
          </form>
        </>
      )}
    </>
  );
}
