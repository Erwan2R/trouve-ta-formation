import { JsonLd, faqJsonLd } from "@/lib/seo/json-ld";

export type QuestionFaq = { question: string; reponse: string };

/**
 * FAQ en <details> natif : réponses dans le DOM au chargement (règle SEO accordéons) + FAQPage.
 * N'utiliser que pour une FAQ propre à la page (jamais dupliquée d'une page à l'autre).
 */
export function Faq({ titre, questions }: { titre: string; questions: QuestionFaq[] }) {
  return (
    <section id="faq" aria-labelledby="faq-titre" className="border-b border-line bg-white py-[88px]">
      <JsonLd data={faqJsonLd(questions)} />
      <div className="mx-auto max-w-[880px] px-7">
        <h2
          id="faq-titre"
          className="mb-8 max-w-[640px] text-[clamp(28px,3.2vw,40px)] leading-[1.1] font-bold tracking-[-0.025em]"
        >
          {titre}
        </h2>
        <div className="border-t border-line">
          {questions.map((q) => (
            <details key={q.question} className="border-b border-line">
              <summary className="flex cursor-pointer items-start justify-between gap-5 py-5 text-[17px] leading-[1.4] font-semibold">
                <h3>{q.question}</h3>
                <span aria-hidden="true" className="flex-none text-lg text-brique-700">
                  +
                </span>
              </summary>
              <p className="mb-5 pr-10 text-base leading-[1.7] text-ink-500">{q.reponse}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
