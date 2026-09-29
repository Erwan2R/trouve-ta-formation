import type { Metadata } from "next";

export const metadata: Metadata = { title: "Créer ma fiche" };

/** Accompagnement à l'inscription : sans la navigation de l'espace, pour rester concentré sur la fiche. */
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex max-w-[1080px] flex-col gap-3.5">{children}</div>;
}
