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
import { renderArtigo, resumo } from "@/lib/markdown";
import { doctor, site } from "@/content/site";
import { ROTA_FORM_WHATSAPP, atributosGate } from "@/lib/whatsapp-gate";

import { Button, Eyebrow, Breadcrumbs, Badge, ArrowLink } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";
import { ProgressoLeitura } from "@/components/ProgressoLeitura";
import { CompartilharArtigo } from "@/components/CompartilharArtigo";
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

/** "CÉLULAS-TRONCO" → "Células-tronco": a categoria vem em caixa alta do WordPress. */
function nomeCategoria(c: string) {
  const t = c.toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function Icone({ d, className = "h-4 w-4" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0 stroke-current`} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const ICONE_RELOGIO = "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z";
const ICONE_CALENDARIO = "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z";

export default async function Artigo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = getArtigo(slug);
  if (!artigo) notFound();

  const { antes, depois, titulos } = renderArtigo(artigo.corpo);
  const relacionados = getRelacionados(slug);
  const url = `${site.url}/artigos/${artigo.slug}`;
  const categoria = nomeCategoria(artigo.categoria);
  const descricaoCitacao = /^[“"]/.test(artigo.descricao.trim());
  const trail = [
    { name: "Início", url: "/" },
    { name: "Artigos", url: "/artigos" },
    { name: artigo.titulo, url: `/artigos/${artigo.slug}` },
  ];

  return (
    <>
      <ProgressoLeitura alvo="corpo-artigo" />

      <article>
        {/* ================= HERO ================= */}
        <header className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 pt-28 pb-20 md:pt-36 md:pb-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-48 -top-40 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.22),transparent_66%)] blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-56 -left-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.14),transparent_68%)] blur-2xl"
          />

          <div className="u-container relative z-10">
            <Breadcrumbs trail={trail} dark />

            <div className="mt-9 grid items-center gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16 xl:gap-20">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{categoria}</Badge>
                  <span className="inline-flex items-center gap-1.5 text-[0.8rem] text-bone-100/55">
                    <Icone d={ICONE_RELOGIO} className="h-3.5 w-3.5" />
                    {artigo.leitura} min de leitura
                  </span>
                </div>

                <h1 className="mt-6 text-[clamp(2.15rem,1.25rem+3.2vw,3.85rem)] leading-[1.04] font-medium tracking-[-0.035em] text-bone-50 [text-wrap:balance]">
                  {artigo.titulo}
                </h1>

                {artigo.descricao &&
                  (descricaoCitacao ? (
                    <blockquote className="relative mt-7 max-w-xl pl-6">
                      <span aria-hidden="true" className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-gold-500 to-gold-500/0" />
                      <p className="u-accent text-[clamp(1.3rem,1.1rem+0.8vw,1.65rem)] leading-[1.4] text-gold-300">
                        {artigo.descricao}
                      </p>
                    </blockquote>
                  ) : (
                    <p className="mt-6 max-w-xl text-lead text-bone-100/72">{artigo.descricao}</p>
                  ))}

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link href="/dr-tercio-rocha" className="group flex items-center gap-3.5">
                    <Image
                      src="/img/tercio-retrato.webp"
                      alt=""
                      width={52}
                      height={52}
                      className="h-[3.25rem] w-[3.25rem] rounded-full object-cover ring-2 ring-gold-500/60 ring-offset-[3px] ring-offset-ink-900"
                    />
                    <span>
                      <span className="block text-[0.95rem] font-medium text-bone-50 transition-colors group-hover:text-gold-300">
                        {doctor.name}
                      </span>
                      <span className="block text-[0.78rem] text-bone-100/50">
                        {doctor.jobTitle} · {doctor.crm[0]}
                      </span>
                    </span>
                  </Link>
                  {artigo.publicado && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-bone-100/12 bg-bone-100/[0.04] px-3.5 py-1.5 text-[0.8rem] text-bone-100/65">
                      <Icone d={ICONE_CALENDARIO} className="h-3.5 w-3.5 text-gold-400" />
                      <time dateTime={artigo.publicado}>{formatarData(artigo.publicado)}</time>
                    </span>
                  )}
                </div>
              </div>

              {/* Capa emoldurada: moldura dourada deslocada, anel que orbita e um selo de autoria. */}
              <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-card border border-gold-500/30 md:-inset-3 md:translate-x-4 md:translate-y-4 md:rounded-[calc(var(--radius-card)+0.75rem)]"
                />
                <div
                  data-anima
                  className="u-ring u-ring-always relative aspect-[4/3] overflow-hidden rounded-card shadow-[0_40px_90px_-30px_rgb(0_0_0/0.65)]"
                >
                  <Image
                    src={artigo.capaLocal}
                    alt={artigo.titulo}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40rem, 100vw"
                    className="object-cover"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-ink-900/0 to-ink-900/0" />
                </div>

                <div className="absolute -bottom-7 left-4 right-4 flex items-center gap-3.5 rounded-card border border-bone-100/15 bg-ink-900/80 p-3.5 pr-5 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.7)] backdrop-blur-md sm:left-auto sm:right-6 sm:max-w-[19rem] lg:-left-6 lg:right-auto">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-500 text-ink-900">
                    <Icone d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" className="h-[1.1rem] w-[1.1rem]" />
                  </span>
                  <span className="text-[0.8rem] leading-snug text-bone-100/70">
                    Escrito pelo <span className="font-medium text-bone-50">{doctor.name}</span>, {doctor.yearsOfPractice} anos de
                    prática clínica
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ================= CORPO ================= */}
        <div className="u-container py-16 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16 xl:gap-24">
            <div id="corpo-artigo" className="mx-auto w-full min-w-0 max-w-[44rem]">
              <div className="prose-artigo" dangerouslySetInnerHTML={{ __html: antes }} />

              {depois && (
                <>
                  {/* Pausa no meio da leitura: no celular a lateral só aparece no fim. */}
                  <aside className="u-grain relative isolate my-14 overflow-hidden rounded-card bg-ink-900 p-7 md:my-16 md:p-9">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.28),transparent_68%)]"
                    />
                    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div>
                        <Eyebrow tone="muted">Uma pausa na leitura</Eyebrow>
                        <p className="mt-3 text-[1.3rem] leading-snug font-medium tracking-tight text-bone-50">
                          O seu caso pode ser{" "}
                          <span className="u-accent text-gold-400">avaliado</span>?
                        </p>
                        <p className="mt-2 max-w-sm text-[0.9rem] leading-relaxed text-bone-100/65">
                          Conte o seu histórico para a equipe. Sem cobrança e sem compromisso.
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row md:flex-col">
                        <Button href="/consulta" variant="gold">
                          Solicitar avaliação
                        </Button>
                        <Link
                          href={ROTA_FORM_WHATSAPP}
                          {...atributosGate({ local: `artigo-meio-${artigo.slug}` })}
                          className="rounded-btn border border-bone-100/25 px-6 py-3 text-center text-[0.86rem] font-medium text-bone-50 transition-colors hover:border-gold-500/70"
                        >
                          Falar no WhatsApp
                        </Link>
                      </div>
                    </div>
                  </aside>

                  <div className="prose-artigo prose-artigo-cont" dangerouslySetInnerHTML={{ __html: depois }} />
                </>
              )}

              {/* Fecho: ornamento, compartilhar e o autor. */}
              <div>
                <div aria-hidden="true" className="mt-16 flex items-center gap-4">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/70" />
                  <span className="h-2 w-2 rotate-45 bg-gold-500" />
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-500/70" />
                </div>

                <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[0.85rem] font-medium text-text-strong">Gostou? Compartilhe com quem precisa:</p>
                  <CompartilharArtigo url={url} titulo={artigo.titulo} />
                </div>

                <div className="u-ring u-halo relative mt-10 overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 p-7 md:p-9">
                  <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start">
                    <Image
                      src="/img/tercio-foto2.jpg"
                      alt={doctor.name}
                      width={112}
                      height={112}
                      className="h-24 w-24 shrink-0 rounded-card object-cover md:h-28 md:w-28"
                    />
                    <div>
                      <Eyebrow>Sobre o autor</Eyebrow>
                      <p className="mt-2 text-[1.25rem] font-medium tracking-tight text-text-strong">{doctor.name}</p>
                      <p className="text-[0.82rem] text-text-muted">
                        {doctor.jobTitle} · {doctor.crm.join(" · ")}
                      </p>
                      <p className="mt-4 text-[0.95rem] leading-relaxed text-text-body">{doctor.summary}</p>
                      <Link href="/dr-tercio-rocha" className="group mt-5 inline-block">
                        <ArrowLink>Conhecer a trajetória</ArrowLink>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= LATERAL ================= */}
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {titulos.length >= 3 && (
                <nav aria-label="Neste artigo" className="rounded-card border border-ink-900/10 bg-bone-50 p-7">
                  <p className="u-eyebrow text-gold-700">Neste artigo</p>
                  <ol className="mt-5 space-y-3 border-l border-gold-500/30 pl-4 text-[0.9rem] leading-snug">
                    {titulos.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} className="text-text-body transition-colors hover:text-gold-700">
                          {t.texto}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div className="u-grain u-ring relative isolate overflow-hidden rounded-card bg-ink-900 p-7 text-bone-100/70">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -right-16 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.22),transparent_68%)]"
                />
                <div className="relative z-10">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-bone-100/[0.06] text-gold-400 ring-1 ring-bone-100/12">
                    <Icone d="M9 12h6m-3-3v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" className="h-5 w-5" />
                  </span>
                  <p className="mt-5 text-[1.18rem] font-medium leading-snug text-bone-50">
                    Seu caso pode ser avaliado?
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-relaxed">
                    Fale com a equipe e descubra se a medicina regenerativa se aplica à sua condição.
                  </p>
                  <Button href="/consulta" variant="gold" className="mt-6 w-full">
                    Quero ser paciente
                  </Button>
                  <Link
                    href={ROTA_FORM_WHATSAPP}
                    {...atributosGate({ local: `artigo-${artigo.slug}` })}
                    className="mt-3 block rounded-btn border border-bone-100/25 px-6 py-3 text-center text-[0.88rem] font-medium text-bone-50 transition-colors hover:border-gold-500/70"
                  >
                    Falar no WhatsApp
                  </Link>
                </div>
              </div>

              <div className="hidden rounded-card border border-ink-900/10 bg-bone-50 p-7 lg:block">
                <p className="u-eyebrow text-gold-700">Compartilhar</p>
                <CompartilharArtigo url={url} titulo={artigo.titulo} className="mt-4" />
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* ================= CONTINUE LENDO ================= */}
      {relacionados.length > 0 && (
        <section className="u-dots relative overflow-hidden border-t border-ink-900/8 bg-bone-200/50 py-20 md:py-24">
          <div className="u-container relative z-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>Continue lendo</Eyebrow>
                <h2 className="mt-4 text-title">
                  Mais do <span className="u-accent text-gold-700">Dr. Tércio</span>
                </h2>
              </div>
              <Button href="/artigos" variant="ghost">
                Todos os artigos
              </Button>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {relacionados.map((r) => (
                <Link
                  key={r.slug}
                  href={`/artigos/${r.slug}`}
                  className="group u-reveal flex flex-col overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 shadow-lift transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-gold-500/45 hover:shadow-lift-hover"
                >
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={r.capaLocal}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 24rem, 100vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-700">
                      {nomeCategoria(r.categoria)} · {r.leitura} min
                    </p>
                    <h3 className="mt-3 text-[1.12rem] leading-snug font-medium tracking-tight text-text-strong transition-colors group-hover:text-gold-700">
                      {r.titulo}
                    </h3>
                    <div className="mt-auto pt-5">
                      <ArrowLink>Ler artigo</ArrowLink>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= FORMULÁRIO ================= */}
      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 py-20 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.18),transparent_68%)] blur-2xl"
        />
        <div className="u-container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <Eyebrow tone="muted">Primeiro passo</Eyebrow>
              <h2 className="mt-4 text-title text-bone-50">
                Conte o seu caso <span className="u-accent text-gold-400">para a equipe</span>
              </h2>
              <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-bone-100/65">
                Sem cobrança e sem compromisso. A equipe da Clínica Tércio Rocha faz a triagem do seu
                caso e o retorno vem pelo WhatsApp.
              </p>
            </div>
            <div className="u-ring rounded-card bg-bone-100 p-6 md:p-8">
              <LeadForm origem={`artigo-${artigo.slug}`} compacto />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(articleSchema(artigo), breadcrumbSchema(trail))} />
    </>
  );
}
