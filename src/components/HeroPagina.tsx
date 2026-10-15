import type { ReactNode } from "react";
import { Badge, Breadcrumbs } from "@/components/ui";

/**
 * Hero das páginas internas (Livros, Perguntas frequentes, Privacidade): o mesmo
 * fundo azul-marinho da home — grão, malha técnica e dois brilhos (azul e dourado) —,
 * selo metalizado, título, chamada e, opcionalmente, um elemento à direita.
 */
export function HeroPagina({
  trail,
  selo,
  titulo,
  chamada,
  rodape,
  lateral,
}: {
  trail: { name: string; url: string }[];
  selo?: string;
  titulo: ReactNode;
  chamada?: ReactNode;
  /** Abaixo da chamada (botões, data, chips). */
  rodape?: ReactNode;
  /** Coluna da direita no computador; abaixo do texto no celular. */
  lateral?: ReactNode;
}) {
  return (
    <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 pt-28 pb-16 md:pt-36 md:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-40 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.22),transparent_66%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -left-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.13),transparent_68%)] blur-2xl"
      />
      <div className="u-container relative z-10">
        <Breadcrumbs trail={trail} dark />
        <div
          className={`mt-9 grid items-center gap-12 ${
            lateral ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16" : ""
          }`}
        >
          <div className="max-w-3xl">
            {selo && <Badge>{selo}</Badge>}
            <h1 className={`${selo ? "mt-6" : ""} text-display text-bone-50 [text-wrap:balance]`}>{titulo}</h1>
            {chamada && <p className="mt-6 max-w-2xl text-lead text-bone-100/72">{chamada}</p>}
            {rodape && <div className="mt-9">{rodape}</div>}
          </div>
          {lateral && <div className="relative">{lateral}</div>}
        </div>
      </div>
    </section>
  );
}
