import { SommaireAncres } from "@/components/public/SommaireAncres";

/** Bloc 3 — ordre des ancres selon le gabarit (B : coût remonté). */
export function SommairePilier({ gabarit }: { gabarit: "A" | "B" }) {
  const fond =
    gabarit === "A"
      ? [
          { id: "bloc4", libelle: "Ce que ça permet" },
          { id: "prerequis", libelle: "Conditions d'inscription" },
          { id: "programme", libelle: "Programme" },
          { id: "cout", libelle: "Durée et coût" },
        ]
      : [
          { id: "bloc4", libelle: "Quand le suivre" },
          { id: "cout", libelle: "Durée et coût" },
          { id: "prerequis", libelle: "Conditions d'inscription" },
          { id: "programme", libelle: "Programme" },
        ];
  return (
    <SommaireAncres
      ancres={[
        ...fond,
        { id: "organismes-titre", libelle: "Les organismes", principale: true },
        { id: "faq", libelle: "Questions fréquentes" },
      ]}
    />
  );
}
