"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Liga as animações em laço apenas nos elementos que estão na tela.
 *
 * O problema que isto resolve: deixar treze badges varrendo em loop permanente
 * mantém a página em repintura contínua mesmo com tudo fora de vista — o Speed
 * Index dobrava e, no celular, é bateria gasta à toa. A saída anterior foi
 * limitar a três repetições, mas aí o efeito acabava antes de a pessoa chegar
 * na seção e o site parecia estático.
 *
 * Com um observador, o laço roda enquanto o elemento está visível e para
 * quando sai. Ninguém perde o efeito e nada anima escondido.
 */
export function AnimacaoEmVista() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const alvos = document.querySelectorAll<HTMLElement>("[data-anima]");
    if (!alvos.length) return;

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          e.target.classList.toggle("em-vista", e.isIntersecting);
        }
      },
      { rootMargin: "120px 0px", threshold: 0 },
    );

    alvos.forEach((a) => io.observe(a));
    return () => io.disconnect();
    /* Refaz a observação a cada navegação: o App Router troca o conteúdo sem
       remontar o layout, então os alvos da página anterior já não existem. */
  }, [pathname]);

  return null;
}
