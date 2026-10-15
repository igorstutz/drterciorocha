import type { Metadata } from "next";
import { faqs, faqGroups, pickFaqs, disclaimer } from "@/content/site";
import { Button, Eyebrow } from "@/components/ui";
import { Faq } from "@/components/Faq";
import { HeroPagina } from "@/components/HeroPagina";
import { IconeWhatsApp } from "@/components/IconeWhatsApp";
import { JsonLd, graph, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Perguntas frequentes sobre células-tronco",
  description:
    "Respostas diretas sobre tratamento com células-tronco: indicações, primeira consulta, valores e idade biológica, pelo Dr. Tércio Rocha.",
  alternates: { canonical: "/perguntas-frequentes" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "Perguntas frequentes", url: "/perguntas-frequentes" },
];

/** Âncora, rótulo curto e ícone de cada tema (na ordem de `faqGroups`). */
const temas = [
  { id: "tratamento", curto: "O tratamento", icone: "M12 3c-1.5 3-5 4.5-5 9a5 5 0 0 0 10 0c0-4.5-3.5-6-5-9zM12 14v4" },
  { id: "medico", curto: "O médico", icone: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
  { id: "consulta", curto: "A consulta", icone: "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM9 14l2 2 4-4" },
];

function Icone({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0 stroke-current`} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function PerguntasFrequentes() {
  return (
    <>
      <HeroPagina
        trail={trail}
        selo={`${faqs.length} respostas diretas`}
        titulo={
          <>
            Perguntas frequentes sobre tratamento com{" "}
            <span className="u-accent text-gold-400">células-tronco</span>
          </>
        }
        chamada="As dúvidas que mais chegam ao consultório do Dr. Tércio Rocha, respondidas de forma direta."
        rodape={
          <div className="flex flex-wrap gap-2.5">
            {faqGroups.map((g, i) => (
              <a
                key={g.title}
                href={`#${temas[i].id}`}
                className="inline-flex items-center gap-2 rounded-full border border-bone-100/15 bg-bone-100/[0.04] px-4 py-2 text-[0.85rem] text-bone-100/80 transition-colors hover:border-gold-500/60 hover:text-gold-300"
              >
                <Icone d={temas[i].icone} className="h-4 w-4 text-gold-400" />
                {temas[i].curto}
                <span className="text-bone-100/45">{g.ids.length}</span>
              </a>
            ))}
          </div>
        }
      />

      <section className="u-dots relative py-20 md:py-28">
        <div className="u-container relative z-10">
          <div className="grid gap-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16 xl:gap-20">
            {/* Índice fixo e contato. */}
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <nav aria-label="Temas" className="hidden rounded-card border border-ink-900/10 bg-bone-50 p-6 lg:block">
                <p className="u-eyebrow text-gold-700">Temas</p>
                <ol className="mt-4 space-y-1">
                  {faqGroups.map((g, i) => (
                    <li key={g.title}>
                      <a
                        href={`#${temas[i].id}`}
                        className="flex items-center gap-3 rounded-btn px-3 py-2.5 text-[0.92rem] text-text-body transition-colors hover:bg-bone-200/70 hover:text-gold-700"
                      >
                        <Icone d={temas[i].icone} className="h-4 w-4 text-gold-600" />
                        <span className="flex-1">{temas[i].curto}</span>
                        <span className="text-[0.78rem] text-text-muted">{g.ids.length}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="u-grain u-ring relative isolate overflow-hidden rounded-card bg-ink-900 p-7 text-bone-100/70">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.3),transparent_68%)]"
                />
                <div className="relative z-10">
                  <span className="grid h-11 w-11 place-items-center rounded-btn bg-jade-500 text-bone-50">
                    <IconeWhatsApp />
                  </span>
                  <p className="mt-5 text-[1.12rem] font-medium leading-snug text-bone-50">Não encontrou a sua dúvida?</p>
                  <p className="mt-2 text-[0.9rem] leading-relaxed">
                    A equipe responde pelo WhatsApp. Sem cobrança e sem compromisso.
                  </p>
                  <Button whatsapp={{ local: "faq-lateral" }} variant="gold" className="mt-6 w-full">
                    Falar no WhatsApp
                  </Button>
                </div>
              </div>
            </aside>

            <div className="min-w-0 space-y-8">
              {faqGroups.map((g, i) => (
                <section
                  key={g.title}
                  id={temas[i].id}
                  className="u-halo relative scroll-mt-28 overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 px-6 pt-7 pb-3 md:px-10 md:pt-9"
                >
                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-ink-900 text-gold-400">
                        <Icone d={temas[i].icone} />
                      </span>
                      <div>
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-gold-700">
                          {String(i + 1).padStart(2, "0")} · {g.ids.length} perguntas
                        </p>
                        <h2 className="mt-1.5 text-[1.35rem] leading-snug font-medium tracking-tight text-text-strong md:text-[1.55rem]">
                          {g.title}
                        </h2>
                      </div>
                    </div>
                    <div className="mt-5 border-t border-ink-900/10">
                      <Faq items={pickFaqs(g.ids)} />
                    </div>
                  </div>
                </section>
              ))}

              <div className="rounded-card border border-ink-900/10 bg-bone-50 p-8 text-center md:p-10">
                <Eyebrow>Próximo passo</Eyebrow>
                <h2 className="mt-4 text-title">Conte o seu caso para a equipe</h2>
                <p className="mx-auto mt-4 max-w-lg text-[1rem] leading-relaxed text-text-body">
                  Descubra se a medicina regenerativa se aplica à sua condição.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button href="/consulta" variant="primary">
                    Solicitar avaliação
                  </Button>
                  <Button whatsapp={{ local: "faq" }} variant="ghost">
                    Falar no WhatsApp
                  </Button>
                </div>
              </div>

              <p className="text-[0.82rem] leading-relaxed text-text-muted">{disclaimer}</p>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(faqSchema(faqs, "/perguntas-frequentes"), breadcrumbSchema(trail))} />
    </>
  );
}
