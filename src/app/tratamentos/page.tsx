import Link from "next/link";
import type { Metadata } from "next";
import { indications, treatmentOptions, doctor, whatsappUrl } from "@/content/site";
import { Button, Badge, Eyebrow, Breadcrumbs, ArrowLink } from "@/components/ui";
import { IconeArea } from "@/components/IconeArea";
import { JsonLd, graph, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Tratamentos com células-tronco",
  description:
    "Áreas de indicação da medicina regenerativa no consultório do Dr. Tércio Rocha: doenças autoimunes, degenerativas, lesões ortopédicas, cardiovasculares, hematológicas e saúde sexual masculina.",
  alternates: { canonical: "/tratamentos" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "Tratamentos", url: "/tratamentos" },
];

/** Condições distintas somadas entre as seis áreas. */
const totalCondicoes = new Set(indications.flatMap((i) => i.conditions)).size;

export default function Tratamentos() {
  return (
    <>
      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 pt-28 pb-14 md:pt-36 md:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.15),transparent_68%)] blur-2xl"
        />
        <div className="u-container relative z-10">
          <Breadcrumbs trail={trail} dark />

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
            <div>
              <Badge variant="gold">Seis áreas de indicação</Badge>
              <h1 className="mt-5 text-display text-bone-50">
                Áreas de indicação da{" "}
                <span className="u-accent text-gold-400">medicina regenerativa</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lead text-bone-100/70">
                As células-tronco atuam na regeneração de tecidos e funções. Abaixo
                estão os grupos de condições mais frequentes no consultório.
              </p>
            </div>

            {/* A coluna estava vazia. Agora carrega os números e a ressalva que
                antes se perdia no fim do parágrafo. */}
            <div className="u-ring rounded-card border border-bone-100/12 bg-bone-100/[0.03] p-6 md:p-7">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                {[
                  { n: String(indications.length), l: "áreas de indicação" },
                  { n: String(totalCondicoes), l: "condições listadas" },
                  { n: `${doctor.yearsOfPractice}+`, l: "anos de prática" },
                  { n: "0", l: "protocolos prontos" },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="text-2xl font-medium tracking-tight text-gold-400">
                      {s.n}
                    </dt>
                    <dd className="mt-1 text-[0.76rem] leading-snug text-bone-100/55">
                      {s.l}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 border-t border-bone-100/10 pt-5 text-[0.84rem] leading-relaxed text-bone-100/60">
                Câncer sólido não é tratado. Nenhuma condição desta página tem
                indicação automática — todas passam por avaliação médica individual.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="u-container">
          {/* Aqui o card é largo, então o ícone vai para uma coluna própria à
              esquerda e o texto ganha a medida inteira — em vez de repetir o
              card estreito da home num tamanho maior. */}
          <div className="grid gap-4 lg:grid-cols-2">
            {indications.map((i, idx) => (
              <Link
                key={i.slug}
                href={`/tratamentos/${i.slug}`}
                className="group u-reveal u-ring u-halo relative flex gap-6 overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 p-7 transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-gold-500/45 hover:shadow-lift-hover md:gap-7 md:p-9"
              >
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-btn bg-ink-900 text-gold-400 transition-colors duration-500 group-hover:bg-gold-600 group-hover:text-ink-900 md:h-14 md:w-14">
                    <IconeArea slug={i.slug} className="h-6 w-6 stroke-current md:h-7 md:w-7" />
                  </span>
                  {/* fio vertical que acende no hover, ligando ícone e conteúdo */}
                  <span
                    aria-hidden="true"
                    className="hidden w-px flex-1 bg-gradient-to-b from-gold-500/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block"
                  />
                </div>

                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-[1.32rem] font-medium leading-snug tracking-tight transition-colors duration-300 group-hover:text-gold-700 md:text-[1.45rem]">
                      {i.title}
                    </h2>
                    <span className="shrink-0 text-[0.68rem] font-semibold tabular-nums text-text-muted/40">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-2.5 text-[0.94rem] leading-relaxed text-text-muted">
                    {i.description}
                  </p>

                  <ul className="mt-5 flex flex-1 flex-wrap content-start gap-x-1.5 gap-y-2">
                    {i.conditions.map((c) => (
                      <li
                        key={c}
                        className="rounded-chip bg-bone-200/90 px-2.5 py-1 text-[0.73rem] font-medium text-text-body"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex items-center justify-between">
                    <ArrowLink>Ver detalhes</ArrowLink>
                    <span className="text-[0.7rem] tabular-nums text-text-muted/60">
                      {i.conditions.length} condições
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone-200/50 py-20 md:py-24">
        <div className="u-container">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>Lista completa</Eyebrow>
            <h2 className="mt-4 text-title">
              Condições avaliadas no consultório
            </h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-text-body">
              Cada item exige avaliação médica individual. A presença nesta lista não
              significa indicação automática de tratamento.
            </p>
            <ul className="mt-10 flex flex-wrap justify-center gap-2.5">
              {treatmentOptions
                .filter((o) => o !== "Outros")
                .map((o) => (
                  <li
                    key={o}
                    className="rounded-chip border border-ink-900/12 bg-bone-50 px-4 py-2 text-[0.86rem] text-text-body"
                  >
                    {o}
                  </li>
                ))}
            </ul>
            <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/consulta" variant="primary">
                Quero ser paciente
              </Button>
              <Button href={whatsappUrl()} variant="ghost" external>
                Tirar uma dúvida no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(breadcrumbSchema(trail))} />
    </>
  );
}
