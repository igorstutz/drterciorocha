import Image from "next/image";
import type { Metadata } from "next";
import { books, ebook, doctor, site } from "@/content/site";
import { Button, Eyebrow, Breadcrumbs } from "@/components/ui";
import { JsonLd, graph, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Livros do Dr. Tércio Rocha",
  description:
    "Longevi Science, Partículas Divinas e Vida na Veia — os livros do Dr. Tércio Rocha sobre células-tronco, medicina regenerativa e longevidade.",
  alternates: { canonical: "/livros" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "Livros", url: "/livros" },
];

export default function Livros() {
  const schemas = books.map((b) => ({
    "@type": "Book",
    "@id": `${site.url}/livros#${b.slug}`,
    name: b.title,
    author: { "@id": `${site.url}/#pessoa` },
    inLanguage: site.locale,
    image: `${site.url}${b.cover}`,
    description: b.description,
    url: b.buyUrl,
  }));

  return (
    <>
      <section className="bg-ink-900 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="u-container">
          <Breadcrumbs trail={trail} dark />
          <h1 className="mt-6 max-w-3xl text-display text-bone-50">
            Livros e publicações
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-bone-100/70">
            Décadas de prática clínica com células-tronco transformadas em três livros
            e um e-book gratuito.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="u-container space-y-20 md:space-y-28">
          {books.map((b, i) => (
            <article
              key={b.slug}
              className={`grid items-center gap-12 lg:gap-20 ${
                i % 2 === 0
                  ? "lg:grid-cols-[0.75fr_1.25fr]"
                  : "lg:grid-cols-[1.25fr_0.75fr]"
              }`}
            >
              <div
                className={`relative mx-auto w-full max-w-[20rem] ${
                  i % 2 === 0 ? "" : "lg:order-2"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-6 -bottom-4 h-8 rounded-full bg-ink-900/12 blur-xl"
                />
                <Image
                  src={b.cover}
                  alt={`Capa do livro ${b.title}, de ${doctor.name}`}
                  width={520}
                  height={740}
                  sizes="(min-width: 1024px) 24vw, 70vw"
                  className="relative w-full rounded-sm shadow-lift"
                />
              </div>

              <div className={i % 2 === 0 ? "" : "lg:order-1"}>
                {b.featured && <Eyebrow>Lançamento</Eyebrow>}
                <h2 className="mt-3 text-title">{b.title}</h2>
                {"subtitle" in b && b.subtitle && (
                  <p className="mt-2 text-[1.05rem] text-text-muted">{b.subtitle}</p>
                )}
                <p className="u-accent mt-5 text-[1.2rem] leading-snug text-gold-700">
                  {b.tagline}
                </p>
                <p className="mt-5 text-[1rem] leading-relaxed text-text-body">
                  {b.description}
                </p>
                <Button href={b.buyUrl} variant="primary" external className="mt-8">
                  Comprar na livraria
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-jade-900 to-ink-900 py-20 md:py-24">
        <div className="u-container">
          <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <Eyebrow tone="muted">Gratuito</Eyebrow>
              <h2 className="mt-4 text-title text-bone-50">{ebook.title}</h2>
              <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-bone-100/70">
                {ebook.description}
              </p>
              <Button href="/ebook-longevidade" variant="gold" className="mt-8">
                Baixar o e-book
              </Button>
            </div>
            <div className="mx-auto w-full max-w-[14rem]">
              <Image
                src={ebook.cover}
                alt={`Capa do e-book ${ebook.title}`}
                width={434}
                height={614}
                sizes="(min-width: 1024px) 16vw, 50vw"
                className="w-full rounded-sm shadow-[0_24px_56px_-20px_rgb(0_0_0/0.6)]"
              />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(...schemas, breadcrumbSchema(trail))} />
    </>
  );
}
