import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { doctor, books, social, sisterSites, regenera, faqById } from "@/content/site";
import { getArtigos } from "@/lib/artigos";
import { Button, Badge, Breadcrumbs, Eyebrow } from "@/components/ui";
import { Faq } from "@/components/Faq";
import { JsonLd, graph, breadcrumbSchema, personSchema, faqSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  /* absolute: com o template o nome do médico sairia duas vezes. */
  title: { absolute: "Dr. Tércio Rocha, endocrinologista | Medicina Regenerativa" },
  description:
    "Conheça o Dr. Tércio Rocha: endocrinologista dedicado à medicina regenerativa desde 1990, autor de três livros e criador do congresso Regenera Brasil.",
  alternates: { canonical: "/dr-tercio-rocha" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "O médico", url: "/dr-tercio-rocha" },
];

const perguntas = [faqById.quem];

/* Frase do próprio Dr. Tércio, do artigo "Relacionamento 50 +". */
const citacao = {
  texto: "A vida é um sopro, senhoras e senhores, mas um sopro a ser vivido!",
  artigo: "/artigos/relacionamento-50",
};

const check = (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 stroke-current" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);

export default function SobreMedico() {
  const totalArtigos = getArtigos().length;

  return (
    <>
      {/* ================= TOPO ================= */}
      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 pt-28 pb-14 md:pt-36 md:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-32 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.22),transparent_66%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-56 -left-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.1),transparent_68%)] blur-2xl"
        />

        <div className="u-container relative z-10">
          <Breadcrumbs trail={trail} dark />

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-20">
            <div>
              <Badge variant="gold">Desde {doctor.since}</Badge>
              <h1 className="mt-6 text-display text-bone-50">
                Dr. Tércio Rocha:{" "}
                <span className="u-accent text-gold-400">médico endocrinologista</span>{" "}
                dedicado à medicina regenerativa
              </h1>
              <p className="mt-6 max-w-xl text-lead text-bone-100/72">
                Mais de {doctor.yearsOfPractice} anos de prática clínica e pesquisa.
                Fundador da Sociedade Brasileira de Medicina Estética e criador do
                Regenera Brasil, congresso de medicina regenerativa.
              </p>
              <ul className="mt-7 flex flex-wrap gap-2">
                {doctor.crm.map((c) => (
                  <li key={c}>
                    <Badge variant="steel">{c}</Badge>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/consulta" variant="gold">
                  Agendar avaliação
                </Button>
                <Button href="#trajetoria" variant="ghostDark">
                  Ler a trajetória
                </Button>
              </div>
            </div>

            {/* Retrato com dois cartões flutuantes de fatos. */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-[26rem]">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[1.6rem] border border-azul-300/20"
              />
              <div
                aria-hidden="true"
                className="absolute -inset-10 rounded-[2.2rem] border border-dashed border-azul-300/12"
              />
              <div data-anima className="u-ring u-ring-always relative aspect-4/5 overflow-hidden rounded-card">
                <Image
                  src="/img/tercio-retrato.webp"
                  alt="Retrato do Dr. Tércio Rocha"
                  fill
                  priority
                  sizes="(min-width: 1024px) 34vw, 90vw"
                  className="object-cover object-top"
                />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-900/80 to-transparent" />
              </div>

              <div className="absolute -left-4 top-10 rounded-card border border-bone-100/15 bg-ink-800/90 px-4 py-3 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md sm:-left-10">
                <p className="text-2xl font-medium tracking-tight text-gold-400">{doctor.yearsOfPractice}+</p>
                <p className="text-[0.72rem] text-bone-100/65">anos de prática clínica</p>
              </div>
              <div className="absolute -right-3 bottom-10 rounded-card border border-bone-100/15 bg-ink-800/90 px-4 py-3 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md sm:-right-8">
                <p className="text-[0.95rem] font-medium text-bone-50">Criador do</p>
                <p className="text-[0.95rem] font-medium text-gold-300">Regenera Brasil</p>
              </div>
            </div>
          </div>

          {/* Faixa de números, como nos outros topos. */}
          <dl className="mt-16 grid grid-cols-2 gap-y-6 border-t border-bone-100/12 pt-8 sm:grid-cols-4 sm:divide-x sm:divide-bone-100/12">
            {[
              { n: `${doctor.yearsOfPractice}+`, l: "anos de prática clínica" },
              { n: String(doctor.crm.length), l: "estados com registro ativo" },
              { n: String(books.length), l: "livros publicados" },
              { n: String(totalArtigos), l: "artigos e casos publicados" },
            ].map((s, i) => (
              <div key={s.l} className={i === 0 ? "sm:pr-6" : "sm:px-6"}>
                <dt className="text-3xl font-medium tracking-tight text-gold-400 md:text-4xl">{s.n}</dt>
                <dd className="mt-1 text-[0.78rem] leading-snug text-bone-100/55">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= TRAJETÓRIA ================= */}
      <section id="trajetoria" className="relative scroll-mt-24 overflow-hidden py-20 md:py-28">
        <div className="u-container">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="relative">
                <div className="u-ring relative aspect-square overflow-hidden rounded-card">
                  <Image
                    src="/img/tercio-foto2.jpg"
                    alt="Dr. Tércio Rocha em atendimento na Clínica Tércio Rocha"
                    fill
                    sizes="(min-width: 1024px) 36vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <figure className="relative -mt-16 ml-6 mr-6 rounded-card bg-ink-900 p-6 text-bone-100/80 shadow-[0_30px_60px_-30px_rgb(10_23_51/0.8)] md:ml-10 md:p-7">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-gold-500/70" aria-hidden="true">
                    <path d="M9.5 6C6 7.3 4 10 4 13.6V18h6v-6H7.2c.2-2 1.4-3.5 3.3-4.3L9.5 6Zm10 0C16 7.3 14 10 14 13.6V18h6v-6h-2.8c.2-2 1.4-3.5 3.3-4.3L19.5 6Z" />
                  </svg>
                  <blockquote className="mt-3 font-accent text-[1.45rem] leading-snug text-bone-50 italic md:text-[1.6rem]">
                    {citacao.texto}
                  </blockquote>
                  <figcaption className="mt-4 text-[0.8rem] text-bone-100/55">
                    {doctor.name}, no artigo{" "}
                    <Link href={citacao.artigo} className="text-gold-400 underline underline-offset-4 hover:text-gold-300">
                      Relacionamento 50 +
                    </Link>
                  </figcaption>
                </figure>
              </div>
            </div>

            <div>
              <Eyebrow>Trajetória</Eyebrow>
              <h2 className="mt-4 text-title">A trajetória do Dr. Tércio Rocha</h2>
              <div className="mt-8 space-y-6 text-[1.05rem] leading-relaxed text-text-body">
                <p className="text-[1.2rem] leading-relaxed text-text-strong">{doctor.bio[0]}</p>
                <p>{doctor.bio[1]}</p>
                <p>{doctor.bio[2]}</p>
              </div>

              <h3 className="mt-14 text-[1.3rem] font-medium tracking-tight">Áreas de atuação</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {doctor.areas.map((a, i) => (
                  <li
                    key={a}
                    className="flex items-center gap-4 rounded-card border border-ink-900/10 bg-bone-50 px-5 py-4 text-[1rem] text-text-strong"
                  >
                    <span aria-hidden="true" className="font-accent text-[1.5rem] leading-none text-gold-600 italic">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CREDENCIAIS ================= */}
      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 py-20 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.2),transparent_68%)] blur-2xl"
        />
        <div className="u-container relative z-10">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Eyebrow tone="muted">Credenciais</Eyebrow>
              <h2 className="mt-4 text-title text-bone-50">Afiliações e registros profissionais</h2>
              <p className="mt-5 text-[1rem] leading-relaxed text-bone-100/65">
                Membro de academias e sociedades médicas no Brasil e no exterior,
                fundador da Sociedade Brasileira de Medicina Estética e com registro
                ativo em três estados.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {doctor.crm.map((c) => (
                  <li key={c}>
                    <Badge variant="gold">{c}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {doctor.affiliations.map((a) => {
                const fundador = a.startsWith("Fundador");
                return (
                  <li
                    key={a}
                    className={`u-reveal relative rounded-card border p-6 ${
                      fundador
                        ? "border-gold-500/40 bg-gold-500/[0.08]"
                        : "border-bone-100/12 bg-bone-100/[0.04]"
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-full ${
                        fundador ? "bg-gold-500 text-ink-900" : "bg-azul-500 text-bone-50"
                      }`}
                    >
                      {check}
                    </span>
                    <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-bone-100/50">
                      {fundador ? "Fundador" : "Membro"}
                    </p>
                    <p className="mt-1 text-[1.02rem] font-medium leading-snug text-bone-50">
                      {fundador ? a.replace(/^Fundador da /, "") : a}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= LIVROS ================= */}
      <section className="u-dots relative overflow-hidden py-20 md:py-28">
        <div className="u-container relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Livros publicados</Eyebrow>
              <h2 className="mt-4 text-title">Ciência e experiência também nas páginas</h2>
            </div>
            <Button href="/livros" variant="ghost">
              Ver todos os livros
            </Button>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {books.map((b) => (
              <article key={b.slug} className="group flex flex-col">
                <div className="relative grid place-items-center rounded-card bg-[linear-gradient(160deg,var(--color-ink-800),var(--color-azul-900))] px-10 py-10">
                  <div aria-hidden="true" className="absolute inset-x-12 bottom-6 h-6 rounded-full bg-black/40 blur-xl" />
                  <Image
                    src={b.cover}
                    alt={`Capa do livro ${b.title}`}
                    width={260}
                    height={380}
                    className="relative h-auto w-[60%] max-w-[11rem] rounded-sm shadow-[0_24px_50px_-18px_rgb(0_0_0/0.8)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:-rotate-1"
                  />
                </div>
                <h3 className="mt-6 text-[1.2rem] font-medium leading-snug tracking-tight">{b.title}</h3>
                <p className="mt-2 flex-1 text-[0.94rem] leading-relaxed text-text-body">{b.summary}</p>
                <a
                  href={b.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[0.88rem] font-semibold text-ink-900 transition-colors hover:text-azul-600"
                >
                  Ver na livraria
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REGENERA E PROJETOS ================= */}
      <section className="pb-20 md:pb-28">
        <div className="u-container">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="relative isolate overflow-hidden rounded-card bg-[linear-gradient(135deg,var(--color-gold-200)_0%,var(--color-bone-100)_60%,var(--color-bone-200)_100%)] p-8 md:p-11">
              <span
                aria-hidden="true"
                className="u-outline-text pointer-events-none absolute -bottom-[0.22em] -right-2 -z-10 select-none text-[7.5rem] leading-none font-semibold tracking-[-0.06em] md:text-[10rem]"
              >
                REGENERA
              </span>
              <Badge variant="gold">Congresso</Badge>
              <h2 className="mt-5 text-title">Regenera Brasil</h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-text-body">{regenera.text}</p>
              <div className="mt-8">
                <Button href={regenera.url} variant="primary" external>
                  Conhecer o Regenera Brasil
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-card border border-ink-900/10 bg-bone-50 p-7">
                <h3 className="u-eyebrow text-gold-700">Onde acompanhar</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {social.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-chip border border-ink-900/12 px-3.5 py-1.5 text-[0.85rem] font-medium text-text-body transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-bone-50"
                      >
                        {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[0.8rem] text-text-muted">{social[0].handle} no Instagram</p>
              </div>

              <div className="flex-1 rounded-card bg-ink-900 p-7 text-bone-100/70">
                <h3 className="u-eyebrow text-azul-300">Outros projetos</h3>
                <ul className="mt-5 divide-y divide-bone-100/10">
                  {sisterSites.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-4 py-3.5"
                      >
                        <span>
                          <span className="block text-[1rem] font-medium text-bone-50 transition-colors group-hover:text-gold-300">
                            {s.name}
                          </span>
                          <span className="mt-0.5 block text-[0.84rem] text-bone-100/55">{s.description}</span>
                        </span>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 stroke-current transition-transform duration-300 group-hover:translate-x-1" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PERGUNTA E CHAMADA ================= */}
      <section className="bg-bone-200/50 py-20 md:py-24">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <Eyebrow>Pergunta frequente</Eyebrow>
              <div className="mt-4">
                <Faq items={perguntas} />
              </div>
            </div>
            <div className="u-grain u-grid-lines relative isolate overflow-hidden rounded-card bg-ink-900 p-8 md:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.3),transparent_68%)]"
              />
              <h2 className="relative text-title text-bone-50">Agende sua avaliação com o Dr. Tércio</h2>
              <p className="relative mt-4 text-[1rem] leading-relaxed text-bone-100/70">
                O primeiro passo é entender o seu caso. A equipe faz a triagem e agenda a
                avaliação, sem cobrança e sem compromisso.
              </p>
              <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/consulta" variant="gold">
                  Agendar avaliação
                </Button>
                <Button whatsapp={{ local: "medico" }} variant="ghostDark">
                  Falar com a equipe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={graph(personSchema, breadcrumbSchema(trail), faqSchema(perguntas, "/dr-tercio-rocha"))}
      />
    </>
  );
}
