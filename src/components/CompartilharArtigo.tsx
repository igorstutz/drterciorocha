"use client";

import { useState } from "react";

/**
 * Compartilhar o artigo: WhatsApp, Facebook, LinkedIn e copiar o link.
 * O WhatsApp aqui é "enviar para alguém" (wa.me sem número) — não é contato com a
 * clínica, então não passa pelo formulário do WhatsAppGate.
 */
export function CompartilharArtigo({
  url,
  titulo,
  escuro = false,
  className = "",
}: {
  url: string;
  titulo: string;
  escuro?: boolean;
  className?: string;
}) {
  const [copiado, setCopiado] = useState(false);
  const enc = encodeURIComponent;
  const redes = [
    {
      nome: "WhatsApp",
      href: `https://wa.me/?text=${enc(`${titulo} — ${url}`)}`,
      icone: <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />,
      preenchido: true,
    },
    {
      nome: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      icone: <path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8z" />,
      preenchido: true,
    },
    {
      nome: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      icone: <path d="M6.5 8.5h-3V20h3V8.5zM5 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM20.5 13.3c0-3-1.6-4.9-4.3-4.9-1.5 0-2.5.8-3 1.5V8.5h-3V20h3v-6.2c0-1.4.7-2.4 2-2.4s1.9 1 1.9 2.4V20h3.4v-6.7z" />,
      preenchido: true,
    },
  ];

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      /* sem permissão de área de transferência: nada a fazer */
    }
  }

  const botao = escuro
    ? "border-bone-100/15 text-bone-100/80 hover:border-gold-500/70 hover:text-gold-300"
    : "border-ink-900/12 text-text-body hover:border-gold-500/70 hover:text-gold-700";

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {redes.map((r) => (
        <a
          key={r.nome}
          href={r.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartilhar no ${r.nome}`}
          className={`grid h-10 w-10 place-items-center rounded-full border transition-colors duration-300 ${botao}`}
        >
          <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem] fill-current" aria-hidden="true">
            {r.icone}
          </svg>
        </a>
      ))}
      <button
        type="button"
        onClick={copiar}
        className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.82rem] font-medium transition-colors duration-300 ${botao}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          {copiado ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />}
        </svg>
        <span aria-live="polite">{copiado ? "Link copiado" : "Copiar link"}</span>
      </button>
    </div>
  );
}
