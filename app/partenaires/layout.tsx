import type { Metadata } from "next";

// Espace organisme : jamais indexé (pages privées ou d'accès).
export const metadata: Metadata = {
  title: { default: "Espace organisme", template: "%s · Espace organisme · Trouve ta formation" },
  robots: { index: false, follow: false },
};

export default function EspaceLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-cream-200 px-[clamp(12px,2vw,24px)] pt-3.5 pb-10">{children}</div>;
}
