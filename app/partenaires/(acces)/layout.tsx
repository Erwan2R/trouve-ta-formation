import { Logo } from "@/components/public/Logo";

/** Pages d'accès (connexion, inscription, mot de passe oublié) : carte centrée, sans navigation. */
export default function AccesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[520px] flex-col gap-6 pt-[clamp(24px,6vw,72px)]">
      <a href="https://trouve-ta-formation.fr/" className="self-center">
        <Logo height={27} priority />
      </a>
      <main className="flex flex-col gap-6 rounded-[28px] border border-line bg-white p-[clamp(22px,4vw,40px)]">
        {children}
      </main>
    </div>
  );
}
