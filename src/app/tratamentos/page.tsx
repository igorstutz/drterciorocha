import Link from "next/link";
import type { Metadata } from "next";
import { indications, treatmentOptions, doctor } from "@/content/site";
import { Button, Badge, Eyebrow, Breadcrumbs } from "@/components/ui";
import { IconeArea } from "@/components/IconeArea";
import { OrbitaAreas } from "@/components/OrbitaAreas";
import { JsonLd, graph, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Tratamentos com células-tronco",
  description:
    "Doenças tratadas com células-tronco pelo Dr. Tércio Rocha: autoimunes, degenerativas, ortopédicas, cardiovasculares, hematológicas e disfunção erétil.",
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
      {/* ================= TOPO ================= */}
      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 pt-28 pb-14 md:pt-36 md:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-32 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.2),transparent_66%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-56 -left-40 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.1),transparent_68%)] blur-2xl"
        />
        <div className="u-container relative z-10">
          <Breadcrumbs trail={trail} dark />

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            <div>
              <Badge variant="gold">Seis áreas de indicação</Badge>
              <h1 className="mt-5 text-display text-bone-50">
                Tratamentos com{" "}
                <span className="u-accent whitespace-nowrap text-gold-400">células-tronco</span>:
                as áreas de indicação
              </h1>
              <p className="mt-5 max-w-2xl text-lead text-bone-100/70">
                O Dr. Tércio Rocha atua em áreas onde a medicina regenerativa tem
                demonstrado resultados promissores. As células-tronco atuam na
                regeneração de tecidos e funções, e cada caso passa por avaliação
                médica individual antes de qualquer indicação.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/consulta" variant="gold">
                  Quero ser paciente
                </Button>
                <Button whatsapp={{ local: "tratamentos-topo" }} variant="ghostDark">
                  Tirar uma dúvida
                </Button>
              </div>
            </div>

            <OrbitaAreas />
          </div>

          {/* Números numa faixa, como no topo da home. */}
          <div className="mt-14 border-t border-bone-100/12 pt-8">
            <dl className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-bone-100/12">
              {[
                { n: String(indications.length), l: "áreas de indicação" },
                { n: String(totalCondicoes), l: "condições listadas" },
                { n: `${doctor.yearsOfPractice}+`, l: "anos de prática" },
                { n: "0", l: "protocolos prontos" },
              ].map((s, i) => (
                <div key={s.l} className={i === 0 ? "sm:pr-6" : "sm:px-6"}>
                  <dt className="text-3xl font-medium tracking-tight text-gold-400 md:text-4xl">
                    {s.n}
                  </dt>
                  <dd className="mt-1 text-[0.78rem] leading-snug text-bone-100/55">{s.l}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-3xl text-[0.82rem] leading-relaxed text-bone-100/50">
              Câncer sólido não é tratado. Nenhuma condição desta página tem indicação
              automática: todas passam por avaliação médica individual.
            </p>
          </div>
        </div>
      </section>

      {/* ================= AS SEIS ÁREAS ================= */}
      <section className="u-dots relative overflow-hidden py-20 md:py-28">
        <div className="u-container relative z-10">
          <div className="grid gap-5 lg:grid-cols-2">
            {indications.map((i, idx) => (
              <Link
                key={i.slug}
                href={`/tratamentos/${i.slug}`}
                className="group u-reveal u-ring u-halo relative flex flex-col overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 p-7 transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-azul-400/45 hover:shadow-lift-hover md:p-9"
              >
                {/* Faixa azul no topo que acende no hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-azul-500 via-azul-400 to-gold-500 transition-transform duration-500 group-hover:scale-x-100"
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#2f5aa8,#0d1d3f_75%)] text-gold-300 shadow-[0_10px_30px_-12px_rgb(53_103_196/0.8)] transition-transform duration-500 group-hover:scale-105">
                    <IconeArea slug={i.slug} className="h-6 w-6 stroke-current md:h-7 md:w-7" />
                  </span>
                  <span aria-hidden="true" className="font-accent text-[2.6rem] leading-none text-gold-600 italic">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="relative z-10 mt-7 text-[1.35rem] font-medium leading-snug tracking-tight transition-colors duration-300 group-hover:text-azul-600 md:text-[1.5rem]">
                  {i.title}
                </h2>
                <p className="relative z-10 mt-2.5 text-[0.95rem] leading-relaxed text-text-muted">
                  {i.description}
                </p>

                <ul className="relative z-10 mt-5 flex flex-1 flex-wrap content-start gap-x-1.5 gap-y-2">
                  {i.conditions.map((c) => (
                    <li
                      key={c}
                      className="rounded-chip border border-azul-400/20 bg-azul-300/15 px-2.5 py-1 text-[0.74rem] font-medium text-ink-700"
                    >
                      {c}
                    </li>
                  ))}
                </ul>

                <div className="relative z-10 mt-8 flex items-center justify-between border-t border-ink-900/8 pt-5">
                  <span className="text-[0.88rem] font-semibold text-ink-900">
                    Ver tratamento
                    <span className="ml-2 text-[0.74rem] font-normal text-text-muted">
                      {i.conditions.length} condições
                    </span>
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-ink-900/15 text-ink-900 transition-[background-color,color,border-color,transform] duration-300 group-hover:translate-x-1 group-hover:border-ink-900 group-hover:bg-ink-900 group-hover:text-bone-50">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LISTA COMPLETA E CHAMADA ================= */}
      <section className="bg-bone-200/50 py-20 md:py-28">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
            <div>
              <Eyebrow>Lista completa</Eyebrow>
              <h2 className="mt-4 text-title">Condições avaliadas no consultório</h2>
              <p className="mt-5 text-[1rem] leading-relaxed text-text-body">
                Cada item exige avaliação médica individual. Estar nesta lista não
                significa indicação automática de tratamento.
              </p>

              <div className="mt-10 border-t border-ink-900/10 pt-8">
                <h3 className="text-[1.3rem] font-medium tracking-tight">
                  Tem dúvidas sobre uma dessas condições?
                </h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-text-body">
                  Converse com a equipe para obter informações sobre o atendimento e
                  entender se o seu caso tem indicação para uma avaliação com o Dr. Tércio.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button href="/consulta" variant="primary">
                    Quero ser paciente
                  </Button>
                  <Button whatsapp={{ local: "tratamentos" }} variant="ghost">
                    Tirar uma dúvida no WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            <div className="u-ring u-ring-always rounded-card bg-bone-50 p-6 shadow-lift md:p-8">
              <p className="u-eyebrow text-azul-600">
                {treatmentOptions.filter((o) => o !== "Outros").length} condições
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {treatmentOptions
                  .filter((o) => o !== "Outros")
                  .map((o) => (
                    <li
                      key={o}
                      className="flex items-center gap-3 rounded-btn border border-ink-900/8 bg-bone-100 px-3.5 py-2.5 text-[0.9rem] text-text-strong"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink-900">
                        <svg viewBox="0 0 24 24" className="h-3 w-3 stroke-azul-300" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      {o}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(breadcrumbSchema(trail))} />
    </>
  );
}
