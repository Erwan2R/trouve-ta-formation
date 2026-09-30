import type { Metadata } from "next";
import { exigerAdmin } from "@/lib/admin-serveur";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function Dashboard() {
  await exigerAdmin();
  return (
    <section className="px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)]">
      <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
        Tableau de bord
      </h1>
    </section>
  );
}
