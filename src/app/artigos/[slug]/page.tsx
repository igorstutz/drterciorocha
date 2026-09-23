import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getArtigo,
  getArtigos,
  getRelacionados,
  formatarData,
} from "@/lib/artigos";
import { renderMarkdown, resumo } from "@/lib/markdown";
import { doctor, whatsappUrl } from "@/content/site";
import { Button, Eyebrow, Breadcrumbs } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";
import { JsonLd, graph, breadcrumbSchema, articleSchema } from "@/lib/jsonld";

export function generateStaticParams() {
  return getArtigos().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArtigo(slug);
  if (!a) return {};

  /* Nove páginas do site antigo não tinham meta description; aqui o primeiro
     parágrafo entra no lugar em vez de deixar o campo vazio. */
  const descricao = a.descricao || resumo(a.corpo);

  return {
    title: a.titulo,
    description: descricao,
    alternates: { canonical: `/artigos/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.titulo,
      description: descricao,
      url: `/artigos/${a.slug}`,
      publishedTime: a.publicado || undefined,
      modifiedTime: a.atualizado || undefined,
      authors: [doctor.name],
      images: a.capaLocal ? [{ url: a.capaLocal, alt: a.titulo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: a.titulo,
      description: descricao,
      images: a.capaLocal ? [a.capaLocal] : undefined,
    },
  };
}

export default async function Artigo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = getArtigo(slug);
  if (!artigo) notFound();

  const html = renderMarkdown(artigo.corpo);
  const relacionados = getRelacionados(slug);
  const trail = [
    { name: "Início", url: "/" },
    { name: "Artigos", url: "/artigos" },
    { name: artigo.titulo, url: `/artigos/${artigo.slug}` },
  ];

  return (
    <>
      <article>
        <header className="bg-ink-900 pt-32 pb-14 md:pt-40 md:pb-16">
          <div className="u-container">
            <Breadcrumbs trail={trail} dark />
            <div className="mt-7 max-w-3xl">
              <Eyebrow tone="muted">{artigo.categoria}</Eyebrow>
              <h1 className="mt-4 text-display text-bone-50">{artigo.titulo}</h1>
              {artigo.descricao && (
                <p className="mt-6 text-lead text-bone-100/70">{artigo.descricao}</p>
              )}

              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-bone-100/12 pt-7">
                <Image
                  src="/img/tercio-retrato.webp"
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-[0.9rem] font-medium text-bone-50">
                    {doctor.name}
                  </p>
                  <p className="text-[0.78rem] text-bone-100/50">
                    {doctor.jobTitle} · {doctor.crm[0]}
                  </p>
                </div>
                <span
                  className="hidden h-8 w-px bg-bone-100/15 sm:block"
                  aria-hidden="true"
                />
                <p className="text-[0.82rem] text-bone-100/55">
                  <time dateTime={artigo.publicado}>
                    {formatarData(artigo.publicado)}
                  </time>{" "}
                  · {artigo.leitura} min de leitura
                </p>
              </div>
            </div>
          </div>
        </header>

        {artigo.capaLocal && (
          <div className="u-container -mt-2">
            <div className="relative aspect-16/9 overflow-hidden rounded-card md:aspect-21/9">
              <Image
                src={artigo.capaLocal}
                alt={artigo.titulo}
                fill
                priority
                sizes="(min-width: 1280px) 76rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="u-container py-16 md:py-20">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
            <div
              className="prose-artigo max-w-[44rem]"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-card bg-ink-900 p-7 text-bone-100/70">
                <h2 className="text-[1.18rem] text-bone-50">
                  Seu caso pode ser avaliado?
                </h2>
                <p className="mt-3 text-[0.92rem] leading-relaxed">
                  Fale com a equipe e descubra se a medicina regenerativa se aplica à
                  sua condição.
                </p>
                <Button href="/consulta" variant="gold" className="mt-6 w-full">
                  Quero ser paciente
                </Button>
                <a
                  href={whatsappUrl(
                    `Olá! Li o artigo "${artigo.titulo}" e gostaria de mais informações.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block rounded-btn border border-bone-100/25 px-6 py-3 text-center text-[0.88rem] font-medium text-bone-50 transition-colors hover:border-gold-500/70"
                >
                  Falar no WhatsApp
                </a>
              </div>

              {relacionados.length > 0 && (
                <div className="rounded-card border border-ink-900/10 bg-bone-50 p-7">
                  <h2 className="u-eyebrow text-gold-700">Leia também</h2>
                  <ul className="mt-5 space-y-5">
                    {relacionados.map((r) => (
                      <li key={r.slug}>
                        <Link href={`/artigos/${r.slug}`} className="group block">
                          <p className="text-[0.98rem] font-medium leading-snug text-text-strong transition-colors group-hover:text-gold-700">
                            {r.titulo}
                          </p>
                          <p className="mt-1 text-[0.78rem] text-text-muted">
                            {r.leitura} min de leitura
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>

      <section className="bg-bone-200/50 py-20 md:py-24">
        <div className="u-container">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <Eyebrow>Primeiro passo</Eyebrow>
              <h2 className="mt-4 text-title">
                Conte o seu caso para a equipe
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-text-body">
                Sem cobrança e sem compromisso. O retorno vem pelo WhatsApp.
              </p>
            </div>
            <div className="mt-10 rounded-card border border-ink-900/10 bg-bone-50 p-7 md:p-9">
              <LeadForm origem={`artigo-${artigo.slug}`} compacto />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(articleSchema(artigo), breadcrumbSchema(trail))} />
    </>
  );
}
