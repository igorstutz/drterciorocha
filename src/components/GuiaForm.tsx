"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { whatsappUrl } from "@/content/site";
import { ATENDIMENTOS, ESTADOS_CIVIS, LOCAIS, MENSAGEM_POS_GUIA, UFS } from "@/content/guia";
import { ENVIO_SIMULADO } from "@/lib/whatsapp-gate";
import { avisoNoTelefone, mascararTelefone, problemaNoTelefone, proximoValorTelefone } from "@/lib/telefone";

/**
 * Ficha em três passos para a guia de solicitação de exames — o /gerar-guia do site antigo.
 *
 * Os três passos ficam montados o tempo todo (só o atual aparece): os valores não se perdem ao
 * voltar, e um FormData só no fim junta tudo. O formulário é `noValidate`; a validação nativa roda
 * passo a passo (`reportValidity` no primeiro campo inválido do passo).
 *
 * `?tel=5511999998888` na URL preenche o WhatsApp — é o link que o painel manda na triagem.
 */

type Estado = "idle" | "enviando" | "ok" | "erro";

const PASSOS = ["Dados do paciente", "Queixas e histórico", "Endereço"] as const;

const campo =
  "w-full rounded-btn border border-ink-500/15 bg-bone-50 px-4 py-3.5 text-[0.98rem] text-text-strong outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-text-muted/60 focus:border-gold-500 focus:shadow-[0_0_0_3px_rgb(196_160_86/0.14)]";
const rotulo = "mb-2 block text-[0.82rem] font-medium text-text-strong";
const seta = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7683' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
};
const select = `${campo} appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11`;

function Campo({
  id,
  label,
  opcional = false,
  children,
}: {
  id: string;
  label: string;
  opcional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={rotulo}>
        {label}
        {opcional && <span className="font-normal text-text-muted"> (opcional)</span>}
      </label>
      {children}
    </div>
  );
}

function Opcoes({ lista, vazio }: { lista: readonly string[]; vazio: string }) {
  return (
    <>
      <option value="" disabled>
        {vazio}
      </option>
      {lista.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </>
  );
}

export function GuiaForm() {
  const [passo, setPasso] = useState(0);
  const [estado, setEstado] = useState<Estado>("idle");
  const [erro, setErro] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroTelefone, setErroTelefone] = useState<string | null>(null);
  const [endereco, setEndereco] = useState({ rua: "", bairro: "", cidade: "", estado: "" });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const tel = new URLSearchParams(window.location.search).get("tel");
    if (tel) setTelefone(mascararTelefone(tel));
  }, []);

  function passoValido() {
    const grupo = formRef.current?.querySelectorAll("fieldset")[passo];
    if (!grupo) return true;
    const campos = grupo.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea",
    );
    /* O WhatsApp passa pela mesma regra do formulário de consulta: número impossível não avança. */
    const tel = grupo.querySelector<HTMLInputElement>('input[name="whatsapp"]');
    if (tel) {
      const problema = problemaNoTelefone(telefone);
      tel.setCustomValidity(problema ?? "");
      setErroTelefone(problema);
    }
    for (const c of campos) {
      if (!c.checkValidity()) {
        c.reportValidity();
        return false;
      }
    }
    return true;
  }

  function irPara(novo: number) {
    setPasso(novo);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function avancar() {
    if (passoValido()) irPara(passo + 1);
  }

  /* CEP preenche rua, bairro, cidade e estado pelo ViaCEP; se falhar, a pessoa digita. */
  async function buscarCep(valor: string) {
    const cep = valor.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const d = await r.json();
      if (d?.erro) return;
      setEndereco((atual) => ({
        rua: d.logradouro || atual.rua,
        bairro: d.bairro || atual.bairro,
        cidade: d.localidade || atual.cidade,
        estado: d.uf || atual.estado,
      }));
    } catch {
      /* sem rede ou serviço fora: segue à mão */
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passoValido()) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("empresa")) return; /* honeypot */

    setEstado("enviando");
    setErro("");

    const dados: Record<string, unknown> = {};
    fd.forEach((v, k) => {
      if (k !== "empresa") dados[k] = v;
    });
    dados.consentimento = fd.get("consentimento") === "on";

    try {
      if (ENVIO_SIMULADO) {
        await new Promise((r) => setTimeout(r, 500));
        setEstado("ok");
        return;
      }
      const res = await fetch("/api/guia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).erro || "Falha no envio");
      setEstado("ok");
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
        <h3 className="mt-5 text-title">Ficha recebida</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-relaxed">
          Seu atendimento continua no WhatsApp. Envie por lá o comprovante do pagamento e a
          equipe emite a sua guia de solicitação de exames.
        </p>
        {ENVIO_SIMULADO && (
          <p className="mx-auto mt-3 max-w-md text-[0.8rem] text-text-muted">
            Prévia: o envio foi simulado e nenhum dado foi gravado.
          </p>
        )}
        <a
          href={whatsappUrl(MENSAGEM_POS_GUIA)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex rounded-btn bg-jade-500 px-7 py-3.5 text-sm font-semibold text-bone-50 transition-colors hover:bg-jade-400"
        >
          Continuar no WhatsApp
        </a>
      </div>
    );
  }

  const ultimo = passo === PASSOS.length - 1;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="scroll-mt-28">
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Passos da ficha">
        {PASSOS.map((p, i) => (
          <li
            key={p}
            aria-current={i === passo ? "step" : undefined}
            className={`border-t-2 pt-2.5 text-[0.8rem] font-medium leading-snug ${
              i === passo
                ? "border-gold-500 text-text-strong"
                : i < passo
                  ? "border-jade-500 text-text-body"
                  : "border-ink-500/15 text-text-muted"
            }`}
          >
            <span className="block text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">
              Passo {i + 1}
            </span>
            {p}
          </li>
        ))}
      </ol>

      {/* Passo 1 — dados do paciente */}
      <fieldset className={passo === 0 ? "space-y-5" : "hidden"}>
        <legend className="sr-only">Dados do paciente</legend>
        <Campo id="g-nome" label="Nome completo do paciente">
          <input id="g-nome" name="nome" required minLength={2} autoComplete="name" placeholder="Como está no documento" className={campo} />
        </Campo>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo id="g-email" label="E-mail">
            <input id="g-email" name="email" type="email" required autoComplete="email" placeholder="seu@email.com" className={campo} />
          </Campo>
          <Campo id="g-whatsapp" label="WhatsApp">
            <input
              id="g-whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => {
                const novo = proximoValorTelefone(telefone, e.target.value);
                setTelefone(novo);
                e.target.setCustomValidity("");
                if (erroTelefone) setErroTelefone(problemaNoTelefone(novo));
              }}
              onBlur={() => telefone && setErroTelefone(problemaNoTelefone(telefone))}
              aria-invalid={erroTelefone ? true : undefined}
              aria-describedby={erroTelefone ? "g-whatsapp-erro" : undefined}
              className={`${campo} ${erroTelefone ? "border-[#b3261e]/60!" : ""}`}
            />
            {erroTelefone && (
              <p id="g-whatsapp-erro" role="alert" className="mt-2 text-[0.82rem] leading-snug text-[#b3261e]">
                {erroTelefone}
              </p>
            )}
            {!erroTelefone && avisoNoTelefone(telefone) && (
              <p id="g-whatsapp-aviso" role="status" className="mt-2 text-[0.82rem] leading-snug text-gold-700">
                {avisoNoTelefone(telefone)}
              </p>
            )}
          </Campo>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo id="g-cpf" label="CPF">
            <input id="g-cpf" name="cpf" inputMode="numeric" required pattern="[\d.\-\s]{11,14}" placeholder="000.000.000-00" className={campo} />
          </Campo>
          <Campo id="g-rg" label="RG" opcional>
            <input id="g-rg" name="rg" placeholder="Número e órgão emissor" className={campo} />
          </Campo>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo id="g-nascimento" label="Data de nascimento">
            <input id="g-nascimento" name="nascimento" type="date" required autoComplete="bday" className={campo} />
          </Campo>
          <Campo id="g-estado-civil" label="Estado civil">
            <select id="g-estado-civil" name="estado_civil" required defaultValue="" className={select} style={seta}>
              <Opcoes lista={ESTADOS_CIVIS} vazio="Selecione" />
            </select>
          </Campo>
        </div>
      </fieldset>

      {/* Passo 2 — queixas */}
      <fieldset className={passo === 1 ? "space-y-5" : "hidden"}>
        <legend className="sr-only">Queixas e histórico</legend>
        <Campo id="g-queixa" label="Queixa principal">
          <textarea
            id="g-queixa"
            name="queixa"
            required
            minLength={3}
            rows={4}
            placeholder="O que mais incomoda hoje, há quanto tempo, diagnósticos que já tem…"
            className={`${campo} resize-y`}
          />
        </Campo>
        <Campo id="g-doencas" label="Outras doenças associadas" opcional>
          <textarea id="g-doencas" name="doencas" rows={2} placeholder="Pressão alta, diabetes…" className={`${campo} resize-y`} />
        </Campo>
        <Campo id="g-metodos" label="Algum outro método já foi utilizado sem sucesso?" opcional>
          <textarea id="g-metodos" name="metodos" rows={2} placeholder="Fisioterapia, infiltração, medicamentos…" className={`${campo} resize-y`} />
        </Campo>
        <div className="grid gap-5 sm:grid-cols-3">
          <Campo id="g-idade" label="Idade">
            <input id="g-idade" name="idade" type="number" inputMode="numeric" required min={1} max={120} placeholder="anos" className={campo} />
          </Campo>
          <Campo id="g-peso" label="Peso (kg)">
            <input id="g-peso" name="peso" inputMode="decimal" required placeholder="63" className={campo} />
          </Campo>
          <Campo id="g-altura" label="Altura (m)">
            <input id="g-altura" name="altura" inputMode="decimal" required placeholder="1,63" className={campo} />
          </Campo>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo id="g-atendimento" label="Tipo de atendimento">
            <select id="g-atendimento" name="atendimento" required defaultValue="" className={select} style={seta}>
              <Opcoes lista={ATENDIMENTOS} vazio="Selecione" />
            </select>
          </Campo>
          <Campo id="g-local" label="Local de atendimento">
            <select id="g-local" name="local" required defaultValue="" className={select} style={seta}>
              <Opcoes lista={LOCAIS} vazio="Selecione" />
            </select>
          </Campo>
        </div>
      </fieldset>

      {/* Passo 3 — endereço */}
      <fieldset className={passo === 2 ? "space-y-5" : "hidden"}>
        <legend className="sr-only">Endereço</legend>
        <div className="grid gap-5 sm:grid-cols-[0.6fr_1.4fr]">
          <Campo id="g-cep" label="CEP">
            <input
              id="g-cep"
              name="cep"
              inputMode="numeric"
              required
              pattern="\d{5}-?\d{3}"
              placeholder="00000-000"
              autoComplete="postal-code"
              onBlur={(e) => buscarCep(e.target.value)}
              className={campo}
            />
          </Campo>
          <Campo id="g-rua" label="Rua">
            <input
              id="g-rua"
              name="rua"
              required
              autoComplete="address-line1"
              value={endereco.rua}
              onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
              className={campo}
            />
          </Campo>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo id="g-numero" label="Número">
            <input id="g-numero" name="numero" required className={campo} />
          </Campo>
          <Campo id="g-complemento" label="Complemento" opcional>
            <input id="g-complemento" name="complemento" autoComplete="address-line2" placeholder="Apto, bloco…" className={campo} />
          </Campo>
        </div>
        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_0.5fr]">
          <Campo id="g-bairro" label="Bairro">
            <input
              id="g-bairro"
              name="bairro"
              required
              value={endereco.bairro}
              onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
              className={campo}
            />
          </Campo>
          <Campo id="g-cidade" label="Cidade">
            <input
              id="g-cidade"
              name="cidade"
              required
              autoComplete="address-level2"
              value={endereco.cidade}
              onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
              className={campo}
            />
          </Campo>
          <Campo id="g-estado" label="Estado">
            <select
              id="g-estado"
              name="estado"
              required
              value={endereco.estado}
              onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })}
              className={select}
              style={seta}
            >
              <Opcoes lista={UFS} vazio="UF" />
            </select>
          </Campo>
        </div>

        <label className="flex cursor-pointer items-start gap-3 pt-1 text-[0.83rem] leading-relaxed text-text-muted">
          <input type="checkbox" name="consentimento" required className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-gold-600)]" />
          <span>
            Autorizo a equipe do Dr. Tércio Rocha a usar estes dados para emitir a guia de
            solicitação de exames e organizar o meu atendimento, conforme a LGPD.
          </span>
        </label>
        <p className="text-[0.78rem] leading-relaxed text-text-muted">
          Os dados de saúde desta ficha são tratados como descrito na{" "}
          <a href="/privacidade" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-gold-700">
            Política de privacidade
          </a>
          .
        </p>
      </fieldset>

      {/* honeypot */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="g-empresa">Empresa</label>
        <input id="g-empresa" name="empresa" tabIndex={-1} autoComplete="off" />
      </div>

      {estado === "erro" && (
        <p role="alert" className="mt-5 text-[0.88rem] text-[#b3261e]">
          {erro} Confira os dados e tente novamente.
        </p>
      )}

      <div className={`mt-8 flex gap-3 ${passo > 0 ? "justify-between" : "justify-end"}`}>
        {passo > 0 && (
          <button
            type="button"
            onClick={() => irPara(passo - 1)}
            className="rounded-btn border border-ink-900/18 px-6 py-3.5 text-[0.9rem] font-semibold text-text-strong transition-colors hover:border-gold-500/60"
          >
            Anterior
          </button>
        )}
        {ultimo ? (
          <button
            type="submit"
            disabled={estado === "enviando"}
            className="rounded-btn bg-ink-900 px-8 py-3.5 text-[0.9rem] font-semibold text-bone-50 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-gold-600 hover:text-ink-900 disabled:cursor-wait disabled:opacity-65"
          >
            {estado === "enviando" ? "Enviando…" : "Enviar ficha"}
          </button>
        ) : (
          <button
            type="button"
            onClick={avancar}
            className="rounded-btn bg-ink-900 px-8 py-3.5 text-[0.9rem] font-semibold text-bone-50 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-gold-600 hover:text-ink-900"
          >
            Próximo
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-[0.78rem] text-text-muted">
        Seus dados não são compartilhados com terceiros.
      </p>
    </form>
  );
}
