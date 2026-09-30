import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { indications, pickFaqs, doctor, whatsappUrl } from "@/content/site";
import { getArtigos } from "@/lib/artigos";
import { Button, Eyebrow, Breadcrumbs, Rule } from "@/components/ui";
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
      <section className="bg-ink-900 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="u-container">
          <Breadcrumbs trail={trail} dark />
          <Eyebrow tone="muted">
            <span className="mt-6 block">Área de indicação</span>
          </Eyebrow>
          <h1 className="mt-4 max-w-4xl text-display text-bone-50">
            {indicacao.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-bone-100/70">
            {indicacao.intro}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#formulario" variant="gold">
              Avaliar meu caso
            </Button>
            <Button
              href={whatsappUrl(
                `Olá! Gostaria de informações sobre células-tronco para ${indicacao.name}.`,
              )}
              variant="ghostDark"
              external
            >
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="u-container">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div>
              <h2 className="text-title">{indicacao.conditionsHeading}</h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-text-body">
                Estar nesta lista não significa indicação automática. Cada caso passa
                por avaliação médica antes de qualquer conduta.
              </p>

              <ul className="mt-9 space-y-px overflow-hidden rounded-card border border-ink-900/10">
                {indicacao.conditions.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-4 bg-bone-50 px-6 py-5 text-[1.02rem] text-text-strong"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                      aria-hidden="true"
                    />
                    {c}
                  </li>
                ))}
              </ul>

              {indicacao.howText && (
                <>
                  <Rule className="my-12" />
                  <h2 className="text-title">{indicacao.howHeading}</h2>
                  <p className="mt-5 text-[1rem] leading-relaxed text-text-body">
                    {indicacao.howText}
                  </p>
                </>
              )}

              <Rule className="my-12" />

              <h2 className="text-title">Como funciona o tratamento com células-tronco</h2>
              <ol className="mt-8 space-y-7">
                {[
                  [
                    "Avaliação clínica",
                    "Histórico completo, exames e entendimento do que mais limita você hoje. Sem isso não há indicação.",
                  ],
                  [
                    "Definição do protocolo",
                    "A conduta é montada caso a caso. Não existe protocolo único aplicado a todos os pacientes.",
                  ],
                  [
                    "Aplicação ambulatorial",
                    "O procedimento é feito em ambiente ambulatorial, sem os riscos e o tempo de recuperação de uma cirurgia.",
                  ],
                  [
                    "Acompanhamento",
                    "Reavaliação ao longo do tempo para medir a resposta e ajustar o que for necessário.",
                  ],
                ].map(([t, d], idx) => (
                  <li key={t} className="flex gap-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-chip border border-gold-500/45 font-display text-[1rem] text-gold-700">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-[1.12rem]">{t}</h3>
                      <p className="mt-1.5 text-[0.96rem] leading-relaxed text-text-body">
                        {d}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-card border border-ink-900/10 bg-bone-50 p-7">
                <div className="flex items-center gap-4">
                  <Image
                    src="/img/tercio-retrato.webp"
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-display text-[1.05rem] text-text-strong">
                      {doctor.name}
                    </p>
                    <p className="text-[0.8rem] text-text-muted">
                      {doctor.jobTitle}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-[0.92rem] leading-relaxed text-text-body">
                  Mais de {doctor.yearsOfPractice} anos de prática clínica e protocolos
                  de longevidade desde {doctor.since}.
                </p>
                <p className="mt-3 text-[0.78rem] text-text-muted">
                  {doctor.crm.join(" · ")}
                </p>
                <Button href="/dr-tercio-rocha" variant="ghost" className="mt-6 w-full">
                  Conhecer o médico
                </Button>
              </div>

              <div className="mt-6 rounded-card bg-ink-900 p-7 text-bone-100/70">
                <h3 className="text-[1.1rem] text-bone-50">Outras áreas</h3>
                <ul className="mt-4 space-y-3">
                  {outras.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/tratamentos/${o.slug}`}
                        className="flex items-center justify-between gap-3 text-[0.92rem] transition-colors hover:text-gold-400"
                      >
                        {o.title}
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 shrink-0 stroke-current"
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
              <h3 className="mt-8 text-[1.15rem] font-medium tracking-tight">
                Tem dúvidas sobre {indicacao.name}?
              </h3>
              <p className="mt-2 text-[1rem] leading-relaxed text-text-body">
                Converse com a equipe para obter informações sobre o atendimento e
                entender se o seu caso tem indicação para uma avaliação com o Dr.
                Tércio.
              </p>
              <div className="mt-6">
                <Button
                  href={whatsappUrl(
                    `Olá! Tenho dúvidas sobre células-tronco para ${indicacao.name}.`,
                  )}
                  variant="ghost"
                  external
                >
                  Falar com a equipe
                </Button>
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
                interesseInicial={
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
                  ) ?? undefined
                }
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
