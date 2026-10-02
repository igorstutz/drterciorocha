import Image from "next/image";
import type { ReactNode } from "react";
import { doctor } from "@/content/site";
import { Button, SectionHeading } from "@/components/ui";
import { IconeWhatsApp } from "@/components/IconeWhatsApp";

/* Ícones de traço, no mesmo desenho dos ícones de área. */
const icones = {
  formulario: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 3.5h6v2.5H9zM8.5 10.5h7M8.5 14h7M8.5 17.5h4" />
    </>
  ),
  conversa: (
    <>
      <path d="M4 5.5h16v10.5H9.5L5 19.5V16H4z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  avaliacao: (
    <>
      <path d="M6 3.5v5a4.5 4.5 0 0 0 9 0v-5" />
      <path d="M10.5 13v2.5a4.5 4.5 0 0 0 9 0V13" />
      <circle cx="19.5" cy="11" r="2" />
    </>
  ),
};

/* Miniaturas de cada etapa: só forma, sem texto inventado. */
function MiniFormulario() {
  return (
    <div aria-hidden="true" className="w-full max-w-[15rem] rounded-lg border border-bone-100/10 bg-bone-100/[0.05] p-3">
      <div className="h-2 w-2/5 rounded-full bg-bone-100/25" />
      <div className="mt-2 h-6 rounded-md border border-bone-100/12 bg-ink-900/40" />
      <div className="mt-2 h-6 rounded-md border border-bone-100/12 bg-ink-900/40" />
      <div className="mt-2.5 flex items-center gap-2">
        <span className="grid h-3.5 w-3.5 place-items-center rounded-[3px] bg-azul-400">
          <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 stroke-ink-900" fill="none" strokeWidth="4" strokeLinecap="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className="h-1.5 w-3/5 rounded-full bg-bone-100/20" />
      </div>
    </div>
  );
}

function MiniConversa() {
  return (
    <div aria-hidden="true" className="w-full max-w-[15rem] space-y-2">
      <div className="ml-auto w-3/4 rounded-xl rounded-br-sm bg-jade-500/85 p-2.5">
        <div className="h-1.5 w-11/12 rounded-full bg-bone-50/70" />
        <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-bone-50/70" />
      </div>
      <div className="flex items-end gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-jade-500 text-bone-50">
          <IconeWhatsApp className="h-3.5 w-3.5" />
        </span>
        <div className="w-3/4 rounded-xl rounded-bl-sm bg-bone-100/10 p-2.5">
          <div className="h-1.5 w-full rounded-full bg-bone-100/30" />
          <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-bone-100/30" />
        </div>
      </div>
    </div>
  );
}

function MiniMedico() {
  return (
    <div className="flex w-full max-w-[15rem] items-center gap-3 rounded-lg border border-gold-500/30 bg-gold-500/[0.08] p-3">
      <Image
        src="/img/tercio-retrato.webp"
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-gold-400/50"
      />
      <div className="text-[0.8rem] leading-snug">
        <p className="font-medium text-bone-50">{doctor.name}</p>
        <p className="text-bone-100/60">{doctor.jobTitle}</p>
        <p className="mt-0.5 text-[0.7rem] font-semibold tracking-[0.08em] text-gold-400">
          {doctor.crm[0]}
        </p>
      </div>
    </div>
  );
}

const passos: {
  icone: ReactNode;
  etapa: string;
  titulo: string;
  texto: string;
  visual: ReactNode;
}[] = [
  {
    icone: icones.formulario,
    etapa: "Menos de 1 minuto",
    titulo: "Você envia seus dados",
    texto: "Pelo formulário do site. É a forma de a equipe já chegar sabendo do seu caso.",
    visual: <MiniFormulario />,
  },
  {
    icone: icones.conversa,
    etapa: "Pelo WhatsApp",
    titulo: "A equipe faz a triagem",
    texto: "Entende seu histórico, suas queixas e o que você busca antes de agendar.",
    visual: <MiniConversa />,
  },
  {
    icone: icones.avaliacao,
    etapa: "Caso a caso",
    titulo: "Avaliação com o Dr. Tércio",
    texto: "A conduta é definida depois da avaliação, sem protocolo pronto.",
    visual: <MiniMedico />,
  },
];

/**
 * "Como funciona a consulta" da home. Um percurso, não uma grade: a linha do
 * tempo corre num painel azul-marinho, cada etapa com uma miniatura do que
 * acontece nela, e a última — a consulta com o médico — termina no dourado.
 */
export function PassosConsulta() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.12),transparent_68%)] blur-2xl"
      />
      <div className="u-container relative">
        {/* No celular a ordem é título, jornada e botões: a pessoa entende o
            caminho antes de clicar. No desktop, título e botões à esquerda. */}
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-0 xl:gap-x-20">
          <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <SectionHeading
              eyebrow="Como funciona"
              title={
                <>
                  Como funciona a consulta: o primeiro passo é{" "}
                  <span className="u-accent text-gold-700">entender o seu caso</span>
                </>
              }
              lead="Cada organismo é único. Por isso, o atendimento começa com uma escuta cuidadosa do histórico, das queixas e dos objetivos do paciente, antes de qualquer indicação clínica."
            />
          </div>

          <div className="u-grain u-grid-lines u-ring u-ring-always relative isolate overflow-hidden rounded-card bg-ink-900 p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center shadow-[0_40px_90px_-40px_rgb(10_23_51/0.7)] sm:p-9 md:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.3),transparent_68%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.16),transparent_68%)]"
            />

            <p className="relative z-10 u-eyebrow text-azul-300">Sua jornada até a consulta</p>

            <ol className="relative z-10 mt-8">
              {/* Trilho: do azul da marca ao dourado da consulta. */}
              <span
                aria-hidden="true"
                className="absolute bottom-12 left-[1.35rem] top-6 w-px bg-gradient-to-b from-azul-400 via-azul-400/60 to-gold-500"
              />
              {passos.map((p, i) => {
                const ultima = i === passos.length - 1;
                return (
                  <li key={p.titulo} className={`u-reveal relative grid grid-cols-[2.75rem_1fr] gap-x-5 ${ultima ? "" : "pb-10"}`}>
                    <span
                      className={`relative z-10 grid h-11 w-11 place-items-center rounded-full ${
                        ultima
                          ? "bg-gold-500 text-ink-900 shadow-[0_0_0_6px_rgb(196_160_86/0.15)]"
                          : "bg-azul-500 text-bone-50 shadow-[0_0_0_6px_rgb(53_103_196/0.18)]"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 stroke-current"
                        fill="none"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        {p.icone}
                      </svg>
                    </span>

                    <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                      <div>
                        <p className="flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
                          <span className="font-accent text-[1.05rem] normal-case tracking-normal text-gold-400 italic">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-bone-100/55">{p.etapa}</span>
                        </p>
                        <h3 className="mt-1.5 text-[1.25rem] font-medium tracking-tight text-bone-50">
                          <span className="sr-only">Etapa {i + 1}: </span>
                          {p.titulo}
                        </h3>
                        <p className="mt-1.5 max-w-sm text-[0.92rem] leading-relaxed text-bone-100/65">
                          {p.texto}
                        </p>
                      </div>
                      <div className="sm:w-[13rem]">{p.visual}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="flex flex-col gap-3 sm:flex-row lg:mt-9">
              <Button href="/consulta" variant="primary">
                Solicitar avaliação
              </Button>
              <Button whatsapp={{ local: "home-como-funciona" }} variant="ghost">
                Falar com a equipe
              </Button>
            </div>

            <p className="mt-8 flex max-w-lg items-start gap-2.5 border-t border-ink-900/10 pt-5 text-[0.82rem] leading-relaxed text-text-muted">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0 stroke-gold-700"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5M12 7.5v.5" />
              </svg>
              A indicação de qualquer protocolo depende de avaliação médica. O conteúdo
              deste site tem caráter informativo e não substitui a consulta.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
