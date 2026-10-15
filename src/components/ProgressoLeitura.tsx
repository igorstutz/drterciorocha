"use client";

import { useEffect, useRef } from "react";

/**
 * Barra fina no topo que acompanha a leitura do corpo do artigo (o elemento `alvo`).
 * Só mexe em transform (compositor), num rAF por rolagem.
 */
export function ProgressoLeitura({ alvo }: { alvo: string }) {
  const barra = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById(alvo);
    if (!el || !barra.current) return;
    let quadro = 0;
    const medir = () => {
      quadro = 0;
      const r = el.getBoundingClientRect();
      const percorrido = innerHeight * 0.35 - r.top;
      const p = Math.min(1, Math.max(0, percorrido / Math.max(1, r.height - innerHeight * 0.4)));
      if (barra.current) barra.current.style.transform = `scaleX(${p})`;
    };
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(medir);
    };
    medir();
    addEventListener("scroll", aoRolar, { passive: true });
    addEventListener("resize", aoRolar);
    return () => {
      removeEventListener("scroll", aoRolar);
      removeEventListener("resize", aoRolar);
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [alvo]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        ref={barra}
        className="h-full origin-left bg-gradient-to-r from-azul-400 via-azul-300 to-gold-500 shadow-[0_0_12px_rgb(196_160_86/0.6)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
