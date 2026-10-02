import type { ReactNode } from "react";

/* Miniaturas de cada etapa: só forma, sem texto inventado nem promessa de
   resultado (o acompanhamento é um calendário de reavaliações, não um gráfico
   subindo). Mesmo desenho da jornada da home (PassosConsulta). */
function MiniFicha() {
  return (
    <div aria-hidden="true" className="w-full max-w-[13rem] rounded-lg border border-bone-100/10 bg-bone-100/[0.05] p-3">
      <div className="flex items-center gap-2">
        <span className="h-6 w-6 rounded-full bg-bone-100/15" />
        <span className="h-2 w-1/2 rounded-full bg-bone-100/25" />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 w-full rounded-full bg-bone-100/15" />
        <div className="h-1.5 w-4/5 rounded-full bg-bone-100/15" />
      </div>
      <div className="mt-3 flex gap-1.5">
        <span className="h-4 w-12 rounded-full bg-azul-400/35" />
        <span className="h-4 w-10 rounded-full bg-azul-400/25" />
        <span className="h-4 w-8 rounded-full bg-bone-100/10" />
      </div>
    </div>
  );
}

function MiniAjustes() {
  return (
    <div aria-hidden="true" className="w-full max-w-[13rem] space-y-3 rounded-lg border border-bone-100/10 bg-bone-100/[0.05] p-3.5">
      {[62, 34, 78].map((pos) => (
        <div key={pos} className="relative h-1.5 rounded-full bg-bone-100/12">
          <div className="absolute inset-y-0 left-0 rounded-full bg-azul-400/60" style={{ width: `${pos}%` }} />
          <span
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-900 bg-azul-300"
            style={{ left: `${pos}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function MiniAmbulatorio() {
  return (
    <div className="flex w-full max-w-[13rem] items-center gap-3 rounded-lg border border-bone-100/10 bg-bone-100/[0.05] p-3">
      <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-azul-500/30 text-azul-300">
        <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20V9l8-5 8 5v11" />
          <path d="M12 10v6M9 13h6" />
        </svg>
      </span>
      <div className="text-[0.75rem] leading-snug">
        <p className="font-medium text-bone-50">Ambiente ambulatorial</p>
        <p className="text-bone-100/55">Sem cirurgia</p>
      </div>
    </div>
  );
}

function MiniCalendario() {
  /* Quatro semanas, com as reavaliações marcadas. */
  const marcados = new Set([3, 11, 24]);
  return (
    <div aria-hidden="true" className="w-full max-w-[13rem] rounded-lg border border-gold-500/30 bg-gold-500/[0.07] p-3">
      <div className="h-1.5 w-2/5 rounded-full bg-bone-100/25" />
      <div className="mt-2.5 grid grid-cols-7 gap-1">
        {Array.from({ length: 28 }, (_, d) => (
          <span
            key={d}
            className={`aspect-square rounded-[3px] ${
              marcados.has(d) ? "bg-gold-400" : "bg-bone-100/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const icones = {
  avaliacao: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 3.5h6v2.5H9zM8.5 11l2 2 4-4M8.5 16.5h7" />
    </>
  ),
  protocolo: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  ambulatorio: (
    <>
      <path d="M4 20V9l8-5 8 5v11" />
      <path d="M12 10v6M9 13h6" />
    </>
  ),
  acompanhamento: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4M9 15l2 2 4-4" />
    </>
  ),
};

const etapas: { icone: ReactNode; rotulo: string; titulo: string; texto: string; visual: ReactNode }[] = [
  {
    icone: icones.avaliacao,
    rotulo: "Histórico e exames",
    titulo: "Avaliação clínica",
    texto: "Histórico completo, exames e entendimento do que mais limita você hoje. Sem isso não há indicação.",
    visual: <MiniFicha />,
  },
  {
    icone: icones.protocolo,
    rotulo: "Caso a caso",
    titulo: "Definição do protocolo",
    texto: "A conduta é montada caso a caso. Não existe protocolo único aplicado a todos os pacientes.",
    visual: <MiniAjustes />,
  },
  {
    icone: icones.ambulatorio,
    rotulo: "Sem cirurgia",
    titulo: "Aplicação ambulatorial",
    texto: "O procedimento é feito em ambiente ambulatorial, sem os riscos e o tempo de recuperação de uma cirurgia.",
    visual: <MiniAmbulatorio />,
  },
  {
    icone: icones.acompanhamento,
    rotulo: "Reavaliação",
    titulo: "Acompanhamento",
    texto: "Reavaliação ao longo do tempo para medir a resposta e ajustar o que for necessário.",
    visual: <MiniCalendario />,
  },
];

/**
 * "Como funciona o tratamento" das páginas de área, no mesmo estilo da jornada
 * da home: painel azul-marinho, trilho do azul ao dourado e uma miniatura do
 * que acontece em cada etapa.
 */
export function JornadaTratamento() {
  return (
    <div className="u-grain u-grid-lines u-ring u-ring-always relative isolate overflow-hidden rounded-card bg-ink-900 p-6 shadow-[0_40px_90px_-40px_rgb(10_23_51/0.7)] sm:p-9 md:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.3),transparent_68%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.16),transparent_68%)]"
      />

      <p className="relative z-10 u-eyebrow text-azul-300">Passo a passo do tratamento</p>

      <ol className="relative z-10 mt-8">
        <span
          aria-hidden="true"
          className="absolute bottom-12 left-[1.35rem] top-6 w-px bg-gradient-to-b from-azul-400 via-azul-400/60 to-gold-500"
        />
        {etapas.map((e, i) => {
          const ultima = i === etapas.length - 1;
          return (
            <li key={e.titulo} className={`u-reveal relative grid grid-cols-[2.75rem_1fr] gap-x-5 ${ultima ? "" : "pb-10"}`}>
              <span
                className={`relative z-10 grid h-11 w-11 place-items-center rounded-full ${
                  ultima
                    ? "bg-gold-500 text-ink-900 shadow-[0_0_0_6px_rgb(196_160_86/0.15)]"
                    : "bg-azul-500 text-bone-50 shadow-[0_0_0_6px_rgb(53_103_196/0.18)]"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {e.icone}
                </svg>
              </span>

              <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center md:gap-6">
                <div>
                  <p className="flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
                    <span className="font-accent text-[1.05rem] normal-case tracking-normal text-gold-400 italic">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-bone-100/55">{e.rotulo}</span>
                  </p>
                  <h3 className="mt-1.5 text-[1.2rem] font-medium tracking-tight text-bone-50">
                    <span className="sr-only">Etapa {i + 1}: </span>
                    {e.titulo}
                  </h3>
                  <p className="mt-1.5 max-w-sm text-[0.92rem] leading-relaxed text-bone-100/65">
                    {e.texto}
                  </p>
                </div>
                <div className="md:w-[12rem]">{e.visual}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
