import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { indications, pickFaqs, doctor } from "@/content/site";
import { getArtigos } from "@/lib/artigos";
import { Button, Badge, Eyebrow, Breadcrumbs } from "@/components/ui";
import { IconeArea } from "@/components/IconeArea";
import { JornadaTratamento } from "@/components/JornadaTratamento";
import { IconeWhatsApp } from "@/components/IconeWhatsApp";
import { LeadForm } from "@/components/LeadForm";
import { Faq } from "@/components/Faq";
import {
  JsonLd,
  graph,
  breadcrumbSchema,
  procedureSchema,
  faqSchema,
} from "@/lib/jsonld";

export function generateStaticParams() {
  return indications.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = indications.find((x) => x.slug === slug);
  if (!i) return {};
  return {
    title: i.seoTitle,
    description: i.metaDescription,
    alternates: { canonical: `/tratamentos/${i.slug}` },
    openGraph: {
      title: `${i.seoTitle} | Dr. Tércio Rocha`,
      description: i.metaDescription,
      url: `/tratamentos/${i.slug}`,
    },
  };
}

const fatos = ["Aplicação ambulatorial", "Sem cirurgia", "Avaliação individual"];

export default async function Tratamento({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const indicacao = indications.find((x) => x.slug === slug);
  if (!indicacao) notFound();

  const trail = [
    { name: "Início", url: "/" },
    { name: "Tratamentos", url: "/tratamentos" },
    { name: indicacao.title, url: `/tratamentos/${indicacao.slug}` },
  ];

  const outras = indications.filter((x) => x.slug !== slug);

  /* Condição da página que também existe nas opções do formulário. */
  const interesseForm =
    indicacao.conditions.find((c) =>
      (
        [
          "Artrose",
          "Alzheimer",
          "Parkinson",
          "Demência",
          "Problemas de coluna",
          "Disfunção erétil",
          "Retonificação peniana",
        ] as string[]
      ).includes(c),
    ) ?? undefined;

  /* Perguntas da própria área primeiro; as gerais completam. Respostas
     clínicas ainda não validadas pelo Dr. Tércio ficam fora. */
  const perguntas = pickFaqs([...indicacao.faqIds, "cirurgico", "primeira", "custo"]);

  /* Artigos cujo título ou descrição citam alguma condição deste grupo. */
  const termos = [indicacao.title, ...indicacao.conditions].map((t) =>
    t.toLowerCase(),
  );
  const relacionados = getArtigos()
    .filter((a) => {
      const texto = `${a.titulo} ${a.descricao}`.toLowerCase();
      return termos.some((t) => texto.includes(t.split(" ")[0]));
    })
    .slice(0, 3);

  return (
    <>
      {/* ================= TOPO ================= */}
      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 pt-28 pb-16 md:pt-36 md:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 -top-40 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.22),transparent_66%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-56 -left-40 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.1),transparent_68%)] blur-2xl"
        />
        <div className="u-container relative z-10">
          <Breadcrumbs trail={trail} dark />

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 xl:gap-20">
            <div>
              <Badge variant="gold">Área de indicação</Badge>
              <h1 className="mt-5 text-display text-bone-50">{indicacao.h1}</h1>
              <p className="mt-6 max-w-2xl text-lead text-bone-100/70">{indicacao.intro}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#formulario" variant="gold">
                  Avaliar meu caso
                </Button>
                <Button
                  whatsapp={{ local: `tratamento-${indicacao.slug}`, interesse: interesseForm }}
                  variant="ghostDark"
                >
                  Falar no WhatsApp
                </Button>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-bone-100/12 pt-6">
                {fatos.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[0.85rem] text-bone-100/70">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 stroke-azul-300" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m4 12.5 5 5L20 6.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cartão da área: o que antes era uma lista branca solta abaixo do
                topo agora sobe para cá, ao lado do título. */}
            <div className="u-ring u-ring-always relative overflow-hidden rounded-card border border-bone-100/12 bg-bone-100/[0.04] p-7 backdrop-blur-sm md:p-9">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-dashed border-azul-300/20"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full border border-azul-300/15"
              />
              <div className="relative flex items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-azul-300/40 bg-[radial-gradient(circle_at_35%_30%,#2f5aa8,#0d1d3f_75%)] text-gold-300 shadow-[0_0_40px_-8px_rgb(77_130_220/0.7)]">
                  <IconeArea slug={indicacao.slug} className="h-7 w-7 stroke-current" />
                </span>
                <p className="u-eyebrow text-azul-300">
                  {indicacao.conditions.length} condições avaliadas
                </p>
              </div>
              <h2 className="relative mt-6 text-[1.35rem] font-medium leading-snug tracking-tight text-bone-50">
                {indicacao.conditionsHeading}
              </h2>
              <ul className="relative mt-5 grid gap-2.5 sm:grid-cols-2">
                {indicacao.conditions.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-3 rounded-btn border border-bone-100/10 bg-ink-800/70 px-4 py-3 text-[0.95rem] text-bone-50"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-azul-500/90">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 stroke-bone-50" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
              <p className="relative mt-5 text-[0.8rem] leading-relaxed text-bone-100/50">
                Estar nesta lista não significa indicação automática. Cada caso passa por
                avaliação médica antes de qualquer conduta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMO ATUA E COMO FUNCIONA ================= */}
      <section className="py-20 md:py-28">
        <div className="u-container">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 xl:gap-20">
            <div>
              {indicacao.howText && (
                <div className="relative mb-16 overflow-hidden rounded-card border border-azul-400/25 bg-[linear-gradient(135deg,rgb(157_188_242/0.18),var(--color-bone-50)_55%)] p-7 md:p-10">
                  <svg
                    viewBox="0 0 200 200"
                    className="pointer-events-none absolute -right-12 -top-12 h-60 w-60 stroke-azul-500/25"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="100" cy="100" r="92" strokeWidth="1" strokeDasharray="2 6" />
                    <circle cx="100" cy="100" r="64" strokeWidth="1" />
                    <circle cx="100" cy="100" r="30" strokeWidth="1.2" />
                    <circle cx="100" cy="100" r="9" className="fill-azul-400/35" strokeWidth="0" />
                    <circle cx="164" cy="100" r="4" className="fill-gold-500/70" strokeWidth="0" />
                    <circle cx="55" cy="55" r="3" className="fill-azul-400/50" strokeWidth="0" />
                  </svg>
                  <div className="relative z-10 max-w-xl">
                    <Badge variant="steel">Como atua</Badge>
                    <h2 className="mt-5 text-title">{indicacao.howHeading}</h2>
                    <p className="mt-4 text-[1.02rem] leading-relaxed text-text-body">
                      {indicacao.howText}
                    </p>
                    <p className="mt-6 border-t border-ink-900/10 pt-4 text-[0.8rem] leading-relaxed text-text-muted">
                      Mecanismo em estudo pela medicina regenerativa. A indicação
                      depende de avaliação médica individual.
                    </p>
                  </div>
                </div>
              )}

              <Eyebrow>Passo a passo</Eyebrow>
              <h2 className="mt-4 text-title">Como funciona o tratamento com células-tronco</h2>
              <div className="mt-9">
                <JornadaTratamento />
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="u-ring relative overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 p-7">
                <p className="u-eyebrow text-gold-700">Quem conduz o tratamento</p>
                <div className="mt-5 flex items-center gap-4">
                  <Image
                    src="/img/tercio-retrato.webp"
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover object-top ring-2 ring-azul-400/40 ring-offset-2 ring-offset-bone-50"
                  />
                  <div>
                    <p className="text-[1.1rem] font-medium tracking-tight text-text-strong">
                      {doctor.name}
                    </p>
                    <p className="text-[0.82rem] text-text-muted">{doctor.jobTitle}</p>
                  </div>
                </div>
                <p className="mt-5 text-[0.92rem] leading-relaxed text-text-body">
                  Mais de {doctor.yearsOfPractice} anos de prática clínica e protocolos de
                  longevidade desde {doctor.since}.
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {doctor.crm.map((c) => (
                    <li key={c}>
                      <Badge variant="steel">{c}</Badge>
                    </li>
                  ))}
                </ul>
                <Button href="/dr-tercio-rocha" variant="ghost" className="mt-6 w-full">
                  Conhecer o médico
                </Button>
              </div>

              <div className="u-grain relative isolate overflow-hidden rounded-card bg-ink-900 p-7 text-bone-100/70">
                <h3 className="text-[1.1rem] font-medium text-bone-50">Outras áreas</h3>
                <ul className="mt-4 divide-y divide-bone-100/8">
                  {outras.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/tratamentos/${o.slug}`}
                        className="group flex items-center gap-3 py-3 text-[0.92rem] transition-colors hover:text-bone-50"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-azul-300/25 text-gold-400 transition-colors group-hover:border-gold-400/60 group-hover:bg-azul-600">
                          <IconeArea slug={o.slug} className="h-4 w-4 stroke-current" />
                        </span>
                        <span className="flex-1">{o.title}</span>
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 shrink-0 stroke-current transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14m-6-6 6 6-6 6" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="bg-bone-200/50 py-20 md:py-24">
          <div className="u-container">
            <Eyebrow>Do consultório</Eyebrow>
            <h2 className="mt-4 text-title">Casos e artigos relacionados</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {relacionados.map((a) => (
                <Link
                  key={a.slug}
                  href={`/artigos/${a.slug}`}
                  className="group flex flex-col overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:border-gold-500/45 hover:shadow-lift-hover"
                >
                  {a.capaLocal && (
                    <div className="relative aspect-16/10 overflow-hidden">
                      <Image
                        src={a.capaLocal}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 31vw, 92vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-[1.12rem] leading-tight transition-colors group-hover:text-gold-700">
                      {a.titulo}
                    </h3>
                    <p className="mt-2.5 line-clamp-2 text-[0.9rem] leading-relaxed text-text-body">
                      {a.descricao}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 md:py-28">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Eyebrow>Dúvidas antes de decidir</Eyebrow>
              <h2 className="mt-4 text-title">
                Perguntas frequentes sobre {indicacao.name} e células-tronco
              </h2>
              <div className="u-halo relative mt-9 rounded-card border border-ink-900/10 bg-bone-50 p-6 md:p-7">
                <div className="relative z-10 flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-jade-500 text-bone-50">
                    <IconeWhatsApp />
                  </span>
                  <div>
                    <h3 className="text-[1.12rem] font-medium tracking-tight">
                      Tem dúvidas sobre {indicacao.name}?
                    </h3>
                    <p className="mt-1.5 text-[0.93rem] leading-relaxed text-text-body">
                      Converse com a equipe para obter informações sobre o atendimento
                      e entender se o seu caso tem indicação para uma avaliação com o
                      Dr. Tércio.
                    </p>
                  </div>
                </div>
                <div className="relative z-10 mt-6">
                  <Button
                    whatsapp={{ local: `tratamento-${indicacao.slug}-faq`, interesse: interesseForm }}
                    variant="primary"
                  >
                    Falar com a equipe
                  </Button>
                </div>
              </div>
            </div>
            <Faq items={perguntas} />
          </div>
        </div>
      </section>

      <section id="formulario" className="bg-ink-900 py-20 md:py-28">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <Eyebrow tone="muted">Primeiro passo</Eyebrow>
              <h2 className="mt-4 text-display text-bone-50">
                Vamos avaliar o seu caso
              </h2>
              <p className="mt-6 text-lead text-bone-100/70">
                Preencha os dados e a equipe entra em contato pelo WhatsApp para
                entender sua condição e agendar a avaliação. Sem cobrança e sem
                compromisso.
              </p>
            </div>
            <div className="rounded-card bg-bone-100 p-7 md:p-9">
              <LeadForm
                origem={`tratamento-${indicacao.slug}`}
                interesseInicial={interesseForm}
              />
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={graph(
          procedureSchema(indicacao),
          breadcrumbSchema(trail),
          faqSchema(perguntas, `/tratamentos/${indicacao.slug}`),
        )}
      />
    </>
  );
}
