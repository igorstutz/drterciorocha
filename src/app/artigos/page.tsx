import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getArtigos, getCategorias, formatarData } from "@/lib/artigos";
import { Eyebrow, Breadcrumbs, Button } from "@/components/ui";
import { JsonLd, graph, breadcrumbSchema } from "@/lib/jsonld";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Artigos e casos clínicos",
  description:
    "Casos reais e reflexões sobre medicina regenerativa, células-tronco e longevidade, escritos pelo Dr. Tércio Rocha.",
  alternates: { canonical: "/artigos" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "Artigos", url: "/artigos" },
];

export default function Artigos() {
  const artigos = getArtigos();
  const categorias = getCategorias();
  const [principal, ...resto] = artigos;

  const listaSchema = {
    "@type": "Blog",
    "@id": `${site.url}/artigos#blog`,
    name: "Artigos do Dr. Tércio Rocha",
    description:
      "Casos reais e reflexões sobre medicina regenerativa, células-tronco e longevidade.",
    url: `${site.url}/artigos`,
    inLanguage: site.locale,
    blogPost: artigos.slice(0, 20).map((a) => ({
      "@type": "BlogPosting",
      headline: a.titulo,
      url: `${site.url}/artigos/${a.slug}`,
      datePublished: a.publicado || undefined,
      author: { "@id": `${site.url}/#pessoa` },
    })),
  };

  return (
    <>
      <section className="bg-ink-900 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="u-container">
          <Breadcrumbs trail={trail} dark />
          <h1 className="mt-6 max-w-4xl text-display text-bone-50">
            Histórias do consultório
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-bone-100/70">
            {artigos.length} textos escritos pelo Dr. Tércio Rocha sobre casos reais,
            células-tronco e o que a medicina regenerativa já consegue fazer. Nomes de
            pacientes foram trocados para preservar a privacidade.
          </p>

          <ul className="mt-9 flex flex-wrap gap-2">
            {categorias.map((c) => (
              <li
                key={c.slug}
                className="rounded-chip border border-bone-100/18 px-4 py-1.5 text-[0.8rem] text-bone-100/70"
              >
                {c.nome} <span className="text-bone-100/40">{c.total}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* destaque */}
      {principal && (
        <section className="py-16 md:py-20">
          <div className="u-container">
            <Link
              href={`/artigos/${principal.slug}`}
              className="group grid overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 transition-[box-shadow,border-color] duration-500 hover:border-gold-500/45 hover:shadow-lift-hover lg:grid-cols-2"
            >
              {principal.capaLocal && (
                <div className="relative aspect-16/10 overflow-hidden lg:aspect-auto lg:min-h-[24rem]">
                  <Image
                    src={principal.capaLocal}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="flex items-center gap-3">
                  <span className="rounded-chip bg-gold-500/15 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-700">
                    Mais recente
                  </span>
                  <Eyebrow>{principal.categoria}</Eyebrow>
                </div>
                <h2 className="mt-5 text-title transition-colors group-hover:text-gold-700">
                  {principal.titulo}
                </h2>
                <p className="mt-4 text-[1rem] leading-relaxed text-text-body">
                  {principal.descricao}
                </p>
                <p className="mt-6 text-[0.82rem] text-text-muted">
                  {formatarData(principal.publicado)} · {principal.leitura} min de
                  leitura
                </p>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="pb-24 md:pb-32">
        <div className="u-container">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {resto.map((a) => (
              <Link
                key={a.slug}
                href={`/artigos/${a.slug}`}
                className="group u-reveal flex flex-col overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-gold-500/45 hover:shadow-lift-hover"
              >
                {a.capaLocal ? (
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={a.capaLocal}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-16/10 bg-gradient-to-br from-ink-800 to-jade-900" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <Eyebrow>{a.categoria}</Eyebrow>
                  <h2 className="mt-3 text-[1.18rem] leading-tight transition-colors group-hover:text-gold-700">
                    {a.titulo}
                  </h2>
                  <p className="mt-3 line-clamp-3 flex-1 text-[0.91rem] leading-relaxed text-text-body">
                    {a.descricao}
                  </p>
                  <time
                    dateTime={a.publicado}
                    className="mt-5 text-[0.78rem] text-text-muted"
                  >
                    {formatarData(a.publicado)} · {a.leitura} min
                  </time>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 rounded-card bg-ink-900 p-10 text-center md:p-14">
            <h2 className="text-title text-bone-50">
              Seu caso pode ser o próximo
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[1rem] leading-relaxed text-bone-100/70">
              As histórias aqui começaram com uma conversa. Conte a sua e a equipe
              retorna pelo WhatsApp.
            </p>
            <Button href="/consulta" variant="gold" className="mt-8">
              Quero ser paciente
            </Button>
          </div>
        </div>
      </section>

      <JsonLd data={graph(listaSchema, breadcrumbSchema(trail))} />
    </>
  );
}
