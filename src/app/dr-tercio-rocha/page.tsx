import Image from "next/image";
import type { Metadata } from "next";
import { doctor, books, social, sisterSites } from "@/content/site";
import { Button, Badge, Breadcrumbs, Rule } from "@/components/ui";
import { JsonLd, graph, breadcrumbSchema, personSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Dr. Tércio Rocha — o médico",
  description:
    "Médico endocrinologista, pioneiro em medicina regenerativa no Brasil e fundador da Sociedade Brasileira de Medicina Estética. Mais de 34 anos de prática clínica.",
  alternates: { canonical: "/dr-tercio-rocha" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "O médico", url: "/dr-tercio-rocha" },
];

export default function SobreMedico() {
  return (
    <>
      {/* Antes esta seção usava `items-end` com a imagem sem teto de altura: o
          retrato ocupava a tela toda e empurrava nome, cargo e CRM para fora da
          primeira vista, deixando metade da tela vazia. Agora a altura é
          limitada como no hero da home e as duas colunas se alinham ao centro. */}
      <section className="u-grain u-grid-lines relative isolate flex items-center overflow-hidden bg-ink-900 pt-28 pb-16 lg:h-svh lg:max-h-[52rem] lg:min-h-[38rem] lg:pb-16 lg:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-32 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.16),transparent_66%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-36 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgb(47_124_104/0.14),transparent_68%)] blur-2xl"
        />

        <div className="u-container relative z-10">
          <Breadcrumbs trail={trail} dark />

          <div className="mt-7 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 xl:gap-20">
            <div>
              <Badge variant="gold">Desde {doctor.since}</Badge>

              <h1 className="mt-6 text-hero text-bone-50">
                Dr. Tércio
                <br />
                <span className="u-accent text-gold-400">Rocha</span>
              </h1>

              <p className="mt-6 max-w-xl text-lead text-bone-100/72">
                {doctor.jobTitle}. Pioneiro em medicina regenerativa no Brasil e
                fundador da Sociedade Brasileira de Medicina Estética.
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

            <div data-anima className="u-ring u-ring-always relative mx-auto aspect-4/5 w-full max-w-sm rounded-card lg:h-[min(62svh,33rem)] lg:w-auto lg:max-w-full">
              <div className="relative h-full w-full overflow-hidden rounded-card">
                <Image
                  src="/img/tercio-retrato.webp"
                  alt="Retrato do Dr. Tércio Rocha"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="u-container">
          <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
            <div className="max-w-2xl">
              <h2 id="trajetoria" className="text-title">A trajetória</h2>
              <div className="mt-7 space-y-6 text-[1.05rem] leading-relaxed text-text-body">
                {doctor.bio.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>

              <Rule className="my-12" />

              <h2 className="text-title">Áreas de atuação</h2>
              <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                {doctor.areas.map((a) => (
                  <li
                    key={a}
                    className="rounded-card border border-ink-900/10 bg-bone-50 px-6 py-5 text-[1rem] text-text-strong"
                  >
                    {a}
                  </li>
                ))}
              </ul>

              <Rule className="my-12" />

              <h2 className="text-title">Livros publicados</h2>
              <div className="mt-8 space-y-6">
                {books.map((b) => (
                  <article
                    key={b.slug}
                    className="flex gap-6 rounded-card border border-ink-900/10 bg-bone-50 p-5"
                  >
                    <Image
                      src={b.cover}
                      alt={`Capa do livro ${b.title}`}
                      width={110}
                      height={158}
                      className="h-auto w-[5.5rem] shrink-0 self-start rounded shadow-lift"
                    />
                    <div>
                      <h3 className="text-[1.15rem] leading-tight">{b.title}</h3>
                      <p className="mt-2 line-clamp-3 text-[0.92rem] leading-relaxed text-text-body">
                        {b.description}
                      </p>
                      <a
                        href={b.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-[0.85rem] font-semibold text-gold-700 underline underline-offset-4 hover:text-gold-600"
                      >
                        Ver na livraria
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-card border border-ink-900/10 bg-bone-50 p-7">
                <h3 className="u-eyebrow text-gold-700">Afiliações</h3>
                <ul className="mt-5 space-y-4">
                  {doctor.affiliations.map((a) => (
                    <li
                      key={a}
                      className="flex items-start gap-3 text-[0.93rem] leading-snug text-text-body"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="mt-1 h-3.5 w-3.5 shrink-0 stroke-gold-600"
                        fill="none"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m4 12.5 5 5L20 6.5" />
                      </svg>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-card border border-ink-900/10 bg-bone-50 p-7">
                <h3 className="u-eyebrow text-gold-700">Onde acompanhar</h3>
                <ul className="mt-5 space-y-3">
                  {social.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 text-[0.93rem] text-text-body transition-colors hover:text-gold-700"
                      >
                        <span>{s.name}</span>
                        <span className="text-[0.8rem] text-text-muted">
                          {s.handle}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-card border border-ink-900/10 bg-bone-50 p-7">
                <h3 className="u-eyebrow text-gold-700">Outros projetos</h3>
                <ul className="mt-5 space-y-4">
                  {sisterSites.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <p className="text-[0.98rem] font-medium text-text-strong transition-colors group-hover:text-gold-700">
                          {s.name}
                        </p>
                        <p className="mt-0.5 text-[0.85rem] text-text-muted">
                          {s.description}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <Button href="/consulta" variant="primary" className="w-full">
                Agendar avaliação
              </Button>
            </aside>
          </div>
        </div>
      </section>

      <JsonLd data={graph(personSchema, breadcrumbSchema(trail))} />
    </>
  );
}
