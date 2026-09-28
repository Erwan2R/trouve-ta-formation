import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { VERTICALES } from "@/lib/config/verticales";

// Menu et footer lisent le référentiel en base : régénérés au plus toutes les heures.
export const revalidate = 3600;

export default function SecuritePriveeLayout({ children }: { children: React.ReactNode }) {
  const verticale = VERTICALES["securite-privee"];
  return (
    <>
      <SiteHeader verticale={verticale} />
      {children}
      <SiteFooter verticale={verticale} />
    </>
  );
}
