import type { Metadata } from "next";

// Espace admin (sous-domaine admin.) : jamais indexé.
export const metadata: Metadata = {
  title: { default: "Espace admin", template: "%s · Admin · Trouve ta formation" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-cream-200 px-[clamp(12px,2vw,24px)] pt-3.5 pb-16">{children}</div>;
}
