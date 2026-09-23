"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Carrossel sobre scroll nativo com scroll-snap (classe `.u-trilho`).
 * O JavaScript aqui só acrescenta os botões e o indicador de progresso —
 * sem ele o trilho continua arrastável por dedo, trackpad e teclado, e todos
 * os cards seguem no HTML, visíveis para o rastreador.
 */
export function Carrossel({
  children,
  rotulo,
  dark = false,
}: {
  children: ReactNode;
  rotulo: string;
  dark?: boolean;
}) {
  const trilho = useRef<HTMLDivElement>(null);
  const [noInicio, setNoInicio] = useState(true);
  const [noFim, setNoFim] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const medir = useCallback(() => {
    const el = trilho.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setNoInicio(el.scrollLeft <= 4);
    setNoFim(el.scrollLeft >= max - 4);
    setProgresso(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, [medir]);

  function mover(direcao: 1 | -1) {
    const el = trilho.current;
    if (!el) return;
    const primeiro = el.firstElementChild as HTMLElement | null;
    const passo = primeiro
      ? primeiro.getBoundingClientRect().width + 20
      : el.clientWidth * 0.8;
    el.scrollBy({ left: passo * direcao, behavior: "smooth" });
  }

  const btn = `u-ring grid h-11 w-11 place-items-center rounded-btn border transition-[border-color,background-color,opacity] duration-300 disabled:pointer-events-none disabled:opacity-25 ${
    dark
      ? "border-bone-100/22 text-bone-50 hover:border-gold-500/70 hover:bg-bone-100/5"
      : "border-ink-900/15 text-text-strong hover:border-gold-500/60 hover:bg-bone-50"
  }`;

  return (
    <div>
      <div
        ref={trilho}
        className="u-trilho"
        role="region"
        aria-label={rotulo}
        tabIndex={0}
      >
        {children}
      </div>

      <div className="mt-7 flex items-center gap-5">
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => mover(-1)}
            disabled={noInicio}
            className={btn}
            aria-label="Anterior"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 stroke-current"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5m6 6-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => mover(1)}
            disabled={noFim}
            className={btn}
            aria-label="Próximo"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 stroke-current"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        </div>

        {/* trilha de progresso */}
        <div
          className={`relative h-px flex-1 ${dark ? "bg-bone-100/15" : "bg-ink-900/12"}`}
          aria-hidden="true"
        >
          <span
            className="absolute inset-y-[-1px] w-24 max-w-full bg-gold-500 transition-[left] duration-200 ease-out"
            style={{ left: `calc(${progresso * 100}% - ${progresso * 6}rem)` }}
          />
        </div>
      </div>
    </div>
  );
}
