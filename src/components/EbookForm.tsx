"use client";

import { useState } from "react";
import { whatsappUrl } from "@/content/site";

/** Isca de e-mail. Três campos: qualquer atrito a mais derruba a conversão. */
export function EbookForm() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "erro">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("empresa")) return;

    setEstado("enviando");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: fd.get("nome"),
          email: fd.get("email"),
          whatsapp: fd.get("whatsapp"),
          interesse: "Anti-Aging",
          mensagem: "Solicitou o e-book de longevidade",
          consentimento: true,
          origem: "ebook-longevidade",
          pagina: "/ebook-longevidade",
        }),
      });
      if (!res.ok) throw new Error();
      setEstado("ok");
    } catch {
      setEstado("erro");
    }
  }

  if (estado === "ok") {
    return (
      <div className="rounded-card bg-bone-100 p-8 text-center md:p-10">
        <h2 className="text-title">E-book a caminho</h2>
        <p className="mt-4 text-[0.98rem] leading-relaxed text-text-body">
          Enviamos o material para o seu e-mail. Se não chegar em alguns minutos,
          confira a caixa de spam ou fale com a equipe.
        </p>
        <a
          href={whatsappUrl("Olá! Pedi o e-book de longevidade no site.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex rounded-btn bg-jade-500 px-7 py-3.5 text-sm font-semibold text-bone-50 transition-colors hover:bg-jade-400"
        >
          Falar no WhatsApp
        </a>
      </div>
    );
  }

  const campo =
    "w-full rounded-btn border border-ink-500/15 bg-bone-50 px-4 py-3.5 text-[0.98rem] text-text-strong outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-text-muted/60 focus:border-gold-500 focus:shadow-[0_0_0_3px_rgb(196_160_86/0.14)]";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-card bg-bone-100 p-7 md:p-9"
    >
      <h2 className="text-[1.4rem]">Receber o e-book gratuito</h2>
      <p className="mt-2.5 text-[0.92rem] leading-relaxed text-text-body">
        Preencha e enviamos o material para o seu e-mail.
      </p>

      <div className="mt-7 space-y-4">
        <div>
          <label htmlFor="eb-nome" className="mb-2 block text-[0.82rem] font-medium text-text-strong">
            Nome
          </label>
          <input id="eb-nome" name="nome" required autoComplete="name" placeholder="Seu nome" className={campo} />
        </div>
        <div>
          <label htmlFor="eb-email" className="mb-2 block text-[0.82rem] font-medium text-text-strong">
            E-mail
          </label>
          <input id="eb-email" name="email" type="email" required autoComplete="email" placeholder="seu@email.com" className={campo} />
        </div>
        <div>
          <label htmlFor="eb-whats" className="mb-2 block text-[0.82rem] font-medium text-text-strong">
            WhatsApp
          </label>
          <input id="eb-whats" name="whatsapp" type="tel" inputMode="tel" required autoComplete="tel" placeholder="(00) 00000-0000" className={campo} />
        </div>
      </div>

      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="eb-empresa">Empresa</label>
        <input id="eb-empresa" name="empresa" tabIndex={-1} autoComplete="off" />
      </div>

      {estado === "erro" && (
        <p role="alert" className="mt-4 text-[0.88rem] text-[#b3261e]">
          Não foi possível enviar. Tente novamente em instantes.
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="mt-7 w-full rounded-btn bg-ink-900 px-8 py-4 text-[0.95rem] font-semibold text-bone-50 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-gold-600 hover:text-ink-900 disabled:cursor-wait disabled:opacity-65"
      >
        {estado === "enviando" ? "Enviando…" : "Quero o e-book"}
      </button>

      <p className="mt-4 text-[0.76rem] leading-relaxed text-text-muted">
        Ao enviar, você autoriza o contato da equipe do Dr. Tércio Rocha conforme a
        LGPD. Seus dados não são compartilhados com terceiros.
      </p>
    </form>
  );
}
