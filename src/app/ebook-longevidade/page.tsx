import Image from "next/image";
import type { Metadata } from "next";
import { ebook, doctor } from "@/content/site";
import { Eyebrow, Breadcrumbs } from "@/components/ui";
import { EbookForm } from "@/components/EbookForm";
import { JsonLd, graph, breadcrumbSchema } from "@/lib/jsonld";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "E-book gratuito: Longevidade",
  description:
    "Como regenerar o corpo e a mente para uma vida saudável e plena. E-book gratuito do Dr. Tércio Rocha sobre envelhecimento biológico e medicina regenerativa.",
  alternates: { canonical: "/ebook-longevidade" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "E-book Longevidade", url: "/ebook-longevidade" },
];

export default function Ebook() {
  const bookSchema = {
    "@type": "Book",
    "@id": `${site.url}/ebook-longevidade#book`,
    name: ebook.title,
    author: { "@id": `${site.url}/#pessoa` },
    inLanguage: site.locale,
    bookFormat: "https://schema.org/EBook",
    image: `${site.url}${ebook.cover}`,
    description: ebook.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: `${site.url}/ebook-longevidade`,
    },
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-jade-900 via-ink-900 to-ink-900 pt-32 pb-20 md:pt-40 md:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.15),transparent_66%)] blur-2xl"
        />
        <div className="u-container relative">
          <Breadcrumbs trail={trail} dark />

          <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <Eyebrow tone="muted">Material gratuito</Eyebrow>
              <h1 className="mt-5 text-display text-bone-50">{ebook.title}</h1>
              <p className="u-accent mt-6 text-[1.3rem] leading-snug text-gold-400">
                {ebook.tagline}
              </p>
              <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-bone-100/70">
                {ebook.description}
              </p>

              <ul className="mt-9 space-y-4">
                {ebook.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3.5 text-[0.98rem] leading-relaxed text-bone-100/80"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-1 h-4 w-4 shrink-0 stroke-gold-500"
                      fill="none"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m4 12.5 5 5L20 6.5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-11 flex items-center gap-4 border-t border-bone-100/12 pt-7">
                <Image
                  src="/img/tercio-retrato.webp"
                  alt=""
                  width={52}
                  height={52}
                  className="h-13 w-13 rounded-full object-cover"
                />
                <p className="text-[0.9rem] leading-snug text-bone-100/65">
                  Escrito por <strong className="font-medium text-bone-50">{doctor.name}</strong>
                  <br />
                  {doctor.jobTitle} · {doctor.crm[0]}
                </p>
              </div>
            </div>

            <div>
              <div className="mx-auto mb-8 w-full max-w-[15rem] lg:hidden">
                <Image
                  src={ebook.cover}
                  alt={`Capa do e-book ${ebook.title}`}
                  width={434}
                  height={614}
                  priority
                  className="w-full rounded-sm shadow-[0_24px_56px_-20px_rgb(0_0_0/0.6)]"
                />
              </div>
              <EbookForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="u-container">
          <div className="mx-auto grid max-w-4xl items-center gap-12 md:grid-cols-[0.7fr_1.3fr]">
            <Image
              src={ebook.cover}
              alt={`Capa do e-book ${ebook.title}`}
              width={434}
              height={614}
              sizes="(min-width: 768px) 20vw, 60vw"
              className="mx-auto w-full max-w-[15rem] rounded-sm shadow-lift"
            />
            <div>
              <Eyebrow>Por que este material</Eyebrow>
              <h2 className="mt-4 text-title">
                Envelhecer não é sinônimo de perder função
              </h2>
              <p className="mt-5 text-[1rem] leading-relaxed text-text-body">
                A idade do documento diz pouco sobre o estado real das suas células.
                O e-book apresenta a diferença entre idade cronológica e biológica, o
                que já é possível medir hoje e quais hábitos têm efeito comprovado
                sobre o segundo número.
              </p>
              <p className="mt-4 text-[1rem] leading-relaxed text-text-body">
                É leitura introdutória e não substitui avaliação médica — mas dá o
                vocabulário para você conversar melhor sobre o próprio caso.
              </p>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(bookSchema, breadcrumbSchema(trail))} />
    </>
  );
}
