"use client";

import { useEffect, useRef, useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import { IconeWhatsApp } from "@/components/IconeWhatsApp";

/**
 * Janela do formulário que antecede o WhatsApp. Escuta cliques em qualquer
 * link com data-whatsapp (ver lib/whatsapp-gate) e abre o formulário aqui,
 * em vez de navegar para /consulta. Sem JavaScript, o link segue para
 * /consulta, que também é formulário: em nenhum caminho o lead pula o registro.
 */
export function WhatsAppGate() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [contexto, setContexto] = useState({ local: "", interesse: "", abertura: 0 });

  useEffect(() => {
    function aoClicar(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const alvo = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-whatsapp]");
      if (!alvo) return;
      e.preventDefault();
      setContexto((c) => ({
        local: alvo.dataset.whatsapp ?? "site",
        interesse: alvo.dataset.interesse ?? "",
        abertura: c.abertura + 1,
      }));
      dialogo.current?.showModal();
    }
    /* Captura: roda antes do onClick do <Link>, que desiste de navegar
       quando o evento já chega com preventDefault. */
    window.addEventListener("click", aoClicar, true);
    return () => window.removeEventListener("click", aoClicar, true);
  }, []);

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="gate-titulo"
      /* Clique no fundo escurecido fecha a janela. */
      onClick={(e) => {
        if (e.target === dialogo.current) dialogo.current?.close();
      }}
      className="m-auto w-[min(34rem,calc(100vw-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-card bg-bone-100 p-0 text-text-body shadow-[0_40px_120px_-30px_rgb(0_0_0/0.7)] backdrop:bg-ink-900/75 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-btn bg-jade-500 text-bone-50">
              <IconeWhatsApp />
            </span>
            <h2 id="gate-titulo" className="text-[1.25rem] font-medium leading-snug tracking-tight text-text-strong">
              Antes de abrir o WhatsApp
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dialogo.current?.close()}
            aria-label="Fechar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink-900/12 text-text-muted transition-colors hover:border-gold-500/60 hover:text-text-strong"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <p className="mt-4 text-[0.95rem] leading-relaxed">
          Deixe seus dados para a equipe já começar a conversa sabendo do seu caso.
          Leva menos de um minuto, e o WhatsApp abre em seguida.
        </p>
        <div className="mt-6">
          {contexto.abertura > 0 && (
            <LeadForm
              key={contexto.abertura}
              origem={`whatsapp-${contexto.local}`}
              interesseInicial={contexto.interesse || undefined}
              compacto
              whatsapp
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
