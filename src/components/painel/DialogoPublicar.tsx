"use client";

import { useEffect, useRef, useState } from "react";
import { Icone } from "@/components/painel/Icone";
import { dataPorExtenso, deCampos, paraCampos, sugestoes } from "@/lib/painel/datas";
import type { Situacao } from "@/lib/painel/tipos";

export type ItemConferido = { rotulo: string; ok: boolean; obrigatorio: boolean; dica?: string };

/**
 * A janela de publicar: escolher entre agora e agendar, com a conferência do que falta antes.
 * Com o artigo já agendado, abre direto no agendamento para mudar a data ou publicar antes.
 */
export function DialogoPublicar({
  aberto,
  onFechar,
  situacao,
  agendadoPara,
  conferencia,
  ocupado,
  onPublicar,
  onAgendar,
  onCancelarAgendamento,
}: {
  aberto: boolean;
  onFechar: () => void;
  situacao: Situacao | null;
  agendadoPara: string;
  conferencia: ItemConferido[];
  ocupado: boolean;
  onPublicar: () => void;
  onAgendar: (iso: string) => void;
  onCancelarAgendamento: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [modo, setModo] = useState<"agora" | "agendar">("agora");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("09:00");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) {
      if (situacao === "agendado" && agendadoPara) {
        const c = paraCampos(agendadoPara);
        setModo("agendar");
        setData(c.data);
        setHora(c.hora);
      } else {
        setModo("agora");
        setData(sugestoes()[0].data);
        setHora("09:00");
      }
      d.showModal();
    }
    if (!aberto && d.open) d.close();
  }, [aberto, situacao, agendadoPara]);

  const iso = deCampos(data, hora);
  const noFuturo = !!iso && Date.parse(iso) > Date.now() + 60_000;
  const pendentes = conferencia.filter((i) => i.obrigatorio && !i.ok);
  const podeConfirmar = pendentes.length === 0 && (modo === "agora" || noFuturo) && !ocupado;
  const hoje = paraCampos(new Date().toISOString()).data;

  return (
    <dialog ref={ref} onClose={onFechar} className="painel-dialogo" aria-labelledby="titulo-publicar">
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          if (!podeConfirmar) return;
          if (modo === "agora") onPublicar();
          else onAgendar(iso);
        }}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <h2 id="titulo-publicar" className="text-[1.3rem] font-medium tracking-tight text-text-strong">
              {situacao === "agendado" ? "Agendamento" : "Publicar artigo"}
            </h2>
            <p className="mt-1 text-[0.88rem] text-text-muted">
              {situacao === "agendado"
                ? `Hoje marcado para ${dataPorExtenso(agendadoPara)}.`
                : "Escolha quando o artigo aparece no site."}
            </p>
          </div>
          <button type="button" onClick={onFechar} aria-label="Fechar" className="painel-botao painel-botao-fantasma -mt-1 -mr-2 h-9 w-9 p-0">
            <Icone nome="fechar" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Agora ou agendar */}
          <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Quando publicar">
            <Opcao
              ativo={modo === "agora"}
              onClick={() => setModo("agora")}
              icone="check"
              titulo="Publicar agora"
              texto="Entra no site assim que você confirmar."
            />
            <Opcao
              ativo={modo === "agendar"}
              onClick={() => setModo("agendar")}
              icone="calendario"
              titulo="Agendar"
              texto="Entra no ar sozinho no dia e na hora."
            />
          </div>

          {modo === "agendar" && (
            <div className="rounded-xl border border-ink-900/10 bg-bone-100/60 p-4">
              <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                <label className="block">
                  <span className="text-[0.8rem] font-medium text-text-strong">Dia</span>
                  <input type="date" required min={hoje} value={data} onChange={(e) => setData(e.target.value)} className="painel-campo mt-1.5" />
                </label>
                <label className="block">
                  <span className="text-[0.8rem] font-medium text-text-strong">Hora</span>
                  <input type="time" required step={300} value={hora} onChange={(e) => setHora(e.target.value)} className="painel-campo mt-1.5" />
                </label>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sugestoes().map((s) => (
                  <button
                    key={s.rotulo}
                    type="button"
                    onClick={() => {
                      setData(s.data);
                      setHora(s.hora);
                    }}
                    className={`rounded-full border px-3 py-1 text-[0.78rem] font-medium transition-colors ${
                      data === s.data && hora === s.hora
                        ? "border-azul-500 bg-azul-500 text-white"
                        : "border-ink-900/15 bg-white text-text-body hover:border-ink-900/30"
                    }`}
                  >
                    {s.rotulo}
                  </button>
                ))}
              </div>
              <p className={`mt-3.5 flex items-start gap-2 text-[0.84rem] ${noFuturo || !iso ? "text-azul-600" : "text-[#a3321f]"}`}>
                <Icone nome={noFuturo || !iso ? "relogio" : "alerta"} className="mt-0.5 h-4 w-4" />
                {!iso
                  ? "Escolha o dia e a hora."
                  : noFuturo
                    ? `Entra no ar ${dataPorExtenso(iso)} (horário de Brasília).`
                    : "Essa data já passou. Escolha um horário no futuro."}
              </p>
            </div>
          )}

          {/* Conferência */}
          <div>
            <p className="text-[0.8rem] font-medium text-text-strong">Antes de publicar</p>
            <ul className="mt-2.5 space-y-2">
              {conferencia.map((i) => (
                <li key={i.rotulo} className="flex items-start gap-2.5 text-[0.86rem]">
                  <span
                    className={`mt-0.5 grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-full ${
                      i.ok ? "bg-emerald-500 text-white" : i.obrigatorio ? "bg-[#c2412d] text-white" : "bg-gold-500/25 text-gold-700"
                    }`}
                  >
                    <Icone nome={i.ok ? "check" : i.obrigatorio ? "fechar" : "alerta"} className="h-3 w-3" />
                  </span>
                  <span className={i.ok ? "text-text-body" : "text-text-strong"}>
                    {i.rotulo}
                    {!i.ok && i.dica && <span className="block text-[0.78rem] text-text-muted">{i.dica}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 rounded-b-2xl border-t border-ink-900/[0.07] bg-bone-100/50 px-6 py-4 sm:flex-row sm:items-center">
          {situacao === "agendado" && (
            <button type="button" disabled={ocupado} onClick={onCancelarAgendamento} className="painel-botao painel-botao-perigo sm:mr-auto">
              Cancelar agendamento
            </button>
          )}
          <button type="button" onClick={onFechar} className={`painel-botao painel-botao-secundario ${situacao === "agendado" ? "" : "sm:ml-auto"}`}>
            Voltar
          </button>
          <button type="submit" disabled={!podeConfirmar} className="painel-botao painel-botao-primario px-5">
            {ocupado
              ? "Salvando…"
              : modo === "agora"
                ? "Publicar agora"
                : situacao === "agendado"
                  ? "Salvar nova data"
                  : "Agendar publicação"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function Opcao({
  ativo,
  onClick,
  icone,
  titulo,
  texto,
}: {
  ativo: boolean;
  onClick: () => void;
  icone: "check" | "calendario";
  titulo: string;
  texto: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={ativo}
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
        ativo ? "border-azul-500 bg-azul-300/10 ring-1 ring-azul-500" : "border-ink-900/12 hover:border-ink-900/25"
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${ativo ? "bg-azul-500 text-white" : "bg-ink-900/[0.06] text-text-muted"}`}
      >
        <Icone nome={icone} className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-[0.92rem] font-medium text-text-strong">{titulo}</span>
        <span className="block text-[0.78rem] leading-snug text-text-muted">{texto}</span>
      </span>
    </button>
  );
}
