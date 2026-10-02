import Image from "next/image";
import { doctor } from "@/content/site";
import { Button, SectionHeading } from "@/components/ui";

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

const passos = [
  {
    icone: icones.formulario,
    titulo: "Você envia seus dados",
    texto: "Pelo formulário ou pelo WhatsApp, em menos de um minuto.",
  },
  {
    icone: icones.conversa,
    titulo: "A equipe faz a triagem",
    texto: "Entende seu histórico, suas queixas e o que você busca.",
  },
  {
    icone: icones.avaliacao,
    titulo: "Avaliação com o Dr. Tércio",
    texto: "A conduta é definida caso a caso, sem protocolo pronto.",
  },
];

/**
 * "Como funciona a consulta" da home. Diferente das grades de cards do resto
 * do site, é um percurso: três etapas ligadas por um trilho dourado, e a
 * última — a consulta com o médico — em destaque escuro, como destino.
 */
export function PassosConsulta() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.12),transparent_68%)] blur-2xl"
      />
      <div className="u-container relative">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
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
          <div className="flex items-start gap-3 rounded-card border border-gold-500/30 bg-gold-200/25 p-5 text-[0.84rem] leading-relaxed text-text-body">
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
            <p>
              A indicação de qualquer protocolo depende de avaliação médica. O
              conteúdo deste site tem caráter informativo e não substitui a
              consulta.
            </p>
          </div>
        </div>

        <ol className="relative mt-14 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {/* Trilho: vertical no celular, horizontal no desktop. Os cards são
              opacos, então ele só aparece nos vãos, como ligação entre etapas. */}
          <span
            aria-hidden="true"
            className="absolute bottom-10 left-[2.15rem] top-10 w-px bg-gradient-to-b from-gold-500/70 via-gold-500/40 to-gold-500/70 lg:left-10 lg:right-10 lg:top-[3.1rem] lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r"
          />

          {passos.map((p, i) => {
            const destino = i === passos.length - 1;
            return (
              <li
                key={p.titulo}
                className={`u-reveal relative flex flex-col rounded-card p-7 md:p-8 ${
                  destino
                    ? "u-grain u-ring u-ring-always isolate overflow-hidden bg-ink-900 text-bone-100/70"
                    : "border border-ink-900/10 bg-bone-50"
                }`}
              >
                {destino && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.22),transparent_68%)]"
                  />
                )}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full ${
                      destino
                        ? "bg-azul-500 text-bone-50"
                        : "border border-gold-500/45 bg-bone-50 text-gold-700"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 stroke-current"
                      fill="none"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {p.icone}
                    </svg>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`font-accent text-[3.4rem] leading-none italic ${
                      destino ? "text-gold-400/80" : "text-gold-600"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3
                  className={`relative z-10 mt-8 text-[1.22rem] font-medium tracking-tight ${
                    destino ? "text-bone-50" : "text-text-strong"
                  }`}
                >
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {p.titulo}
                </h3>
                <p
                  className={`relative z-10 mt-2 text-[0.95rem] leading-relaxed ${
                    destino ? "text-bone-100/70" : "text-text-body"
                  }`}
                >
                  {p.texto}
                </p>

                {destino && (
                  <div className="relative z-10 mt-7 flex items-center gap-3 border-t border-bone-100/10 pt-5">
                    <Image
                      src="/img/tercio-retrato.webp"
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover object-top"
                    />
                    <div className="text-[0.8rem] leading-snug">
                      <p className="font-medium text-bone-50">{doctor.name}</p>
                      <p className="text-bone-100/55">{doctor.crm[0]}</p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href="/consulta" variant="primary">
            Solicitar avaliação
          </Button>
          <Button whatsapp={{ local: "home-como-funciona" }} variant="ghost">
            Falar com a equipe
          </Button>
        </div>
      </div>
    </section>
  );
}
