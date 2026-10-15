import Image from "next/image";
import type { Metadata } from "next";
import { books, ebook, doctor, site } from "@/content/site";
import { Button, Eyebrow } from "@/components/ui";
import { HeroPagina } from "@/components/HeroPagina";
import { JsonLd, graph, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  /* absolute: com o template o nome do médico sairia duas vezes. */
  title: { absolute: "Livros do Dr. Tércio Rocha | Células-tronco e Longevidade" },
  description:
    "Longevi Science, Partículas Divinas e Vida na Veia: os livros do Dr. Tércio Rocha sobre células-tronco, medicina regenerativa e longevidade.",
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
      <HeroPagina
        trail={trail}
        selo="Três livros e um e-book"
        titulo={
          <>
            Livros do Dr. Tércio Rocha sobre{" "}
            <span className="u-accent text-gold-400">células-tronco</span> e longevidade
          </>
        }
        chamada="Ciência e experiência também nas páginas: décadas de prática clínica com células-tronco transformadas em três livros e um e-book gratuito."
        rodape={
          <div className="flex flex-wrap gap-3">
            <Button href="#livros" variant="gold">
              Conhecer os livros
            </Button>
            <Button href="/ebook-longevidade" variant="ghostDark">
              Baixar o e-book gratuito
            </Button>
          </div>
        }
        lateral={
          /* As três capas em leque, a do meio à frente. */
          <div aria-hidden="true" className="relative mx-auto h-[19rem] w-full max-w-[26rem] sm:h-[23rem]">
            <div className="absolute inset-x-10 bottom-0 h-10 rounded-full bg-black/50 blur-2xl" />
            {books.map((b, i) => {
              const pos = [
                "left-0 top-6 -rotate-[9deg]",
                "left-1/2 top-0 z-10 -translate-x-1/2",
                "right-0 top-6 rotate-[9deg]",
              ][i % 3];
              return (
                <div
                  key={b.slug}
                  className={`absolute w-[42%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 ${pos}`}
                >
                  <Image
                    src={b.cover}
                    alt=""
                    width={520}
                    height={740}
                    priority
                    sizes="(min-width: 1024px) 12rem, 40vw"
                    className="w-full rounded-[3px] shadow-[0_30px_60px_-18px_rgb(0_0_0/0.75)] ring-1 ring-white/10"
                  />
                </div>
              );
            })}
          </div>
        }
      />

      <section id="livros" className="scroll-mt-24 py-20 md:py-28">
        <div className="u-container space-y-16 md:space-y-24">
          {books.map((b, i) => (
            <article
              key={b.slug}
              className={`grid items-center gap-12 lg:gap-20 ${
                i % 2 === 0
                  ? "lg:grid-cols-[0.75fr_1.25fr]"
                  : "lg:grid-cols-[1.25fr_0.75fr]"
              }`}
            >
              <div className={`group relative ${i % 2 === 0 ? "" : "lg:order-2"}`}>
                {/* Palco: painel com brilho, número do livro e a capa com sombra de objeto. */}
                <div className="u-ring relative isolate overflow-hidden rounded-card bg-gradient-to-br from-bone-200 via-bone-100 to-bone-50 px-8 py-12 md:px-14 md:py-16">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.22),transparent_68%)]"
                  />
                  <span
                    aria-hidden="true"
                    className="u-outline-text absolute -bottom-6 left-4 font-accent text-[9rem] leading-none italic select-none md:text-[11rem]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative mx-auto w-full max-w-[16rem] [perspective:1200px]">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-4 -bottom-5 h-8 rounded-full bg-ink-900/25 blur-xl"
                    />
                    <Image
                      src={b.cover}
                      alt={`Capa do livro ${b.title}, de ${doctor.name}`}
                      width={520}
                      height={740}
                      sizes="(min-width: 1024px) 16rem, 60vw"
                      className="relative w-full rounded-[3px] shadow-[0_34px_60px_-24px_rgb(10_23_51/0.7)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform:rotateY(-8deg)] group-hover:[transform:rotateY(0deg)_translateY(-6px)]"
                    />
                  </div>
                </div>
              </div>

              <div className={i % 2 === 0 ? "" : "lg:order-1"}>
                <div className="flex items-center gap-3">
                  <span className="font-accent text-[1.4rem] italic text-gold-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px w-10 bg-gold-500/50" />
                  {b.featured ? <Eyebrow>Lançamento</Eyebrow> : <Eyebrow>Livro</Eyebrow>}
                </div>
                <h2 className="mt-4 text-title">{b.title}</h2>
                {"subtitle" in b && b.subtitle && (
                  <p className="mt-2 text-[1.05rem] text-text-muted">{b.subtitle}</p>
                )}
                <p className="u-accent mt-5 text-[1.2rem] leading-snug text-gold-700">
                  {b.tagline}
                </p>
                <p className="mt-5 text-[1.05rem] font-medium leading-relaxed text-text-strong">
                  {b.summary}
                </p>
                <p className="mt-4 text-[1rem] leading-relaxed text-text-body">
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

      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-gradient-to-br from-azul-900 to-ink-900 py-20 md:py-24">
        <div className="u-container relative z-10">
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
                className="w-full -rotate-3 rounded-sm shadow-[0_24px_56px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/10 transition-transform duration-700 hover:rotate-0"
              />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(...schemas, breadcrumbSchema(trail))} />
    </>
  );
}
