"use client";

import { useEffect, useRef, useState } from "react";
import { treatmentOptions, whatsappUrl } from "@/content/site";

type Estado = "idle" | "enviando" | "ok" | "erro";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

export function LeadForm({
  origem,
  interesseInicial,
  compacto = false,
}: {
  origem: string;
  interesseInicial?: string;
  compacto?: boolean;
}) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [erro, setErro] = useState("");
  const utmRef = useRef<Record<string, string>>({});

  /* Captura UTM/gclid na montagem e guarda por 30 dias: o lead que chega por
     anúncio hoje e converte semana que vem continua atribuído à campanha certa.
     O formulário antigo do Elementor não registrava origem nenhuma. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const atual: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) atual[k] = v;
    });

    try {
      if (Object.keys(atual).length) {
        localStorage.setItem(
          "dtr_atribuicao",
          JSON.stringify({ ...atual, referrer: document.referrer, ts: Date.now() }),
        );
        utmRef.current = atual;
      } else {
        const salvo = localStorage.getItem("dtr_atribuicao");
        if (salvo) {
          const dados = JSON.parse(salvo);
          if (Date.now() - (dados.ts ?? 0) < 30 * 864e5) utmRef.current = dados;
        }
      }
    } catch {
      utmRef.current = atual;
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    /* Honeypot: bots preenchem campos escondidos, gente não. */
    if (fd.get("empresa")) return;

    setEstado("enviando");
    setErro("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: fd.get("nome"),
          whatsapp: fd.get("whatsapp"),
          email: fd.get("email"),
          interesse: fd.get("interesse"),
          mensagem: fd.get("mensagem") || "",
          consentimento: fd.get("consentimento") === "on",
          origem,
          pagina: window.location.pathname,
          atribuicao: utmRef.current,
        }),
      });

      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).erro || "Falha no envio");

      setEstado("ok");
      form.reset();
    } catch (err) {
      setEstado("erro");
      setErro(err instanceof Error ? err.message : "Não foi possível enviar.");
    }
  }

  if (estado === "ok") {
    return (
      <div className="rounded-card border border-jade-500/25 bg-jade-900/5 p-8 text-center md:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-jade-500/12">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 stroke-jade-600"
            fill="none"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m4 12.5 5 5L20 6.5" />
          </svg>
        </div>
        <h3 className="mt-5 text-title">Recebemos seus dados</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-relaxed">
          Nossa equipe entra em contato pelo WhatsApp para entender seu caso e agendar
          a avaliação com o Dr. Tércio.
        </p>
        <a
          href={whatsappUrl("Olá! Acabei de preencher o formulário no site.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex rounded-btn bg-jade-500 px-7 py-3.5 text-sm font-semibold text-bone-50 transition-colors hover:bg-jade-400"
        >
          Prefiro falar agora no WhatsApp
        </a>
      </div>
    );
  }

  const campo =
    "w-full rounded-btn border border-ink-500/15 bg-bone-50 px-4 py-3.5 text-[0.98rem] text-text-strong outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-text-muted/60 focus:border-gold-500 focus:shadow-[0_0_0_3px_rgb(196_160_86/0.14)]";
  const rotulo = "mb-2 block text-[0.82rem] font-medium text-text-strong";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className={compacto ? "space-y-5" : "grid gap-5 sm:grid-cols-2"}>
        <div>
          <label htmlFor={`nome-${origem}`} className={rotulo}>
            Nome completo
          </label>
          <input
            id={`nome-${origem}`}
            name="nome"
            required
            autoComplete="name"
            placeholder="Como podemos te chamar"
            className={campo}
          />
        </div>
        <div>
          <label htmlFor={`whatsapp-${origem}`} className={rotulo}>
            WhatsApp
          </label>
          <input
            id={`whatsapp-${origem}`}
            name="whatsapp"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            className={campo}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`email-${origem}`} className={rotulo}>
          E-mail
        </label>
        <input
          id={`email-${origem}`}
          name="email"
          required
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          className={campo}
        />
      </div>

      <div>
        <label htmlFor={`interesse-${origem}`} className={rotulo}>
          O que você pretende tratar?
        </label>
        <select
          id={`interesse-${origem}`}
          name="interesse"
          required
          defaultValue={interesseInicial ?? ""}
          className={`${campo} appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7683' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          {treatmentOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {!compacto && (
        <div>
          <label htmlFor={`mensagem-${origem}`} className={rotulo}>
            Conte um pouco do seu caso{" "}
            <span className="font-normal text-text-muted">(opcional)</span>
          </label>
          <textarea
            id={`mensagem-${origem}`}
            name="mensagem"
            rows={4}
            placeholder="Há quanto tempo, tratamentos já feitos, o que mais incomoda hoje…"
            className={`${campo} resize-y`}
          />
        </div>
      )}

      {/* honeypot */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`empresa-${origem}`}>Empresa</label>
        <input id={`empresa-${origem}`} name="empresa" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-[0.83rem] leading-relaxed text-text-muted">
        <input
          type="checkbox"
          name="consentimento"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-gold-600)]"
        />
        <span>
          Autorizo o contato da equipe do Dr. Tércio Rocha pelos dados informados e o
          tratamento deles conforme a LGPD. Posso solicitar a exclusão a qualquer momento.
        </span>
      </label>

      {estado === "erro" && (
        <p role="alert" className="text-[0.88rem] text-[#b3261e]">
          {erro} Você também pode{" "}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            falar direto no WhatsApp
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="group relative w-full overflow-hidden rounded-btn bg-ink-900 px-8 py-4 text-[0.95rem] font-semibold text-bone-50 transition-[transform,opacity] duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65"
      >
        <span className="relative z-10">
          {estado === "enviando" ? "Enviando…" : "Quero ser paciente do Dr. Tércio"}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gold-600 to-gold-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
      </button>

      <p className="text-center text-[0.78rem] text-text-muted">
        Seus dados não são compartilhados com terceiros.
      </p>
    </form>
  );
}
