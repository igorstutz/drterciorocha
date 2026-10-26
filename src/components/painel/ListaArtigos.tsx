"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icone } from "@/components/painel/Icone";
import { Selo } from "@/components/painel/Selo";
import { dataCurta, dataHora, dataPorExtenso, haQuanto } from "@/lib/painel/datas";
import { nomeDaCategoria } from "@/lib/slug";
import { AUTOR_PADRAO, getAutor } from "@/content/autores";
import type { Situacao } from "@/lib/painel/tipos";

export type ItemDaLista = {
  id: string;
  slug: string;
  titulo: string;
  categoria: string;
  capaLocal: string;
  situacao: Situacao;
  publicado: string;
  /** Quando entra no ar (diferente de `publicado` no agendamento de artigo com data própria). */
  entraNoAr: string;
  atualizado: string;
  atualizadoPor: string;
  autor: string;
  leitura: number;
};

type Filtro = "todos" | Situacao;

const ABAS: { valor: Filtro; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "publicado", rotulo: "No ar" },
  { valor: "agendado", rotulo: "Agendados" },
  { valor: "rascunho", rotulo: "Rascunhos" },
];

const VAZIO: Record<Filtro, string> = {
  todos: "Nenhum artigo encontrado.",
  publicado: "Nenhum artigo no ar com essa busca.",
  agendado: "Nenhum artigo agendado. Ao publicar, escolha “Agendar” para marcar o dia e a hora.",
  rascunho: "Nenhum rascunho. Um artigo salvo sem publicar aparece aqui.",
};

/** Sem acento e minúsculo, para a busca achar "celula" em "Células". */
const normalizar = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* Agendados primeiro (o mais próximo no topo), depois rascunhos e por fim os publicados, do mais novo ao mais antigo. */
const PESO: Record<Situacao, number> = { agendado: 0, rascunho: 1, publicado: 2 };
function ordenar(a: ItemDaLista, b: ItemDaLista) {
  if (a.situacao !== b.situacao) return PESO[a.situacao] - PESO[b.situacao];
  if (a.situacao === "agendado") return Date.parse(a.entraNoAr) - Date.parse(b.entraNoAr);
  if (a.situacao === "rascunho") return Date.parse(b.atualizado || "0") - Date.parse(a.atualizado || "0");
  return Date.parse(b.publicado) - Date.parse(a.publicado);
}

export function ListaArtigos({ itens, saudacao }: { itens: ItemDaLista[]; saudacao: string }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");

  const total = useMemo(() => {
    const t = { todos: itens.length, publicado: 0, agendado: 0, rascunho: 0 };
    for (const i of itens) t[i.situacao]++;
    return t;
  }, [itens]);

  const proximo = useMemo(() => itens.filter((i) => i.situacao === "agendado").sort(ordenar)[0], [itens]);
  const ultimo = useMemo(() => itens.filter((i) => i.situacao === "publicado").sort(ordenar)[0], [itens]);

  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());
    return itens
      .filter((i) => filtro === "todos" || i.situacao === filtro)
      .filter((i) => !termo || normalizar(`${i.titulo} ${i.categoria} ${getAutor(i.autor).nome}`).includes(termo))
      .sort(ordenar);
  }, [itens, filtro, busca]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[0.9rem] text-text-muted">{saudacao}</p>
          <h1 className="mt-1 text-[2rem] leading-tight font-medium tracking-[-0.03em] text-text-strong">Artigos</h1>
        </div>
        <Link href="/admin/artigos/novo" className="painel-botao painel-botao-primario hidden h-11 px-5 lg:inline-flex">
          <Icone nome="mais" className="h-4 w-4" />
          Novo artigo
        </Link>
      </div>

      {/* Resumo */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Numero
          rotulo="No ar"
          valor={total.publicado}
          detalhe={ultimo ? `Último em ${dataCurta(ultimo.publicado)}` : "—"}
          tom="verde"
        />
        <Numero
          rotulo="Agendados"
          valor={total.agendado}
          detalhe={proximo ? `Próximo: ${dataHora(proximo.entraNoAr)}` : "Nenhum na fila"}
          tom="azul"
        />
        <Numero
          rotulo="Rascunhos"
          valor={total.rascunho}
          detalhe={total.rascunho ? "Ainda não publicados" : "Tudo publicado"}
          tom="cinza"
        />
        <Link
          href="/admin/artigos/novo"
          className="group u-grain relative isolate flex flex-col justify-between overflow-hidden rounded-[0.875rem] bg-ink-900 p-4 text-bone-50 md:p-5"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.35),transparent_68%)] transition-transform duration-500 group-hover:scale-125"
          />
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500 text-ink-900">
            <Icone nome="pena" className="h-4 w-4" />
          </span>
          <span className="mt-4 block">
            <span className="block text-[0.98rem] font-medium">Escrever um artigo</span>
            <span className="block text-[0.78rem] text-bone-100/55">Começar do zero</span>
          </span>
        </Link>
      </div>

      {proximo && (
        <Link
          href={`/admin/artigos/${proximo.id}`}
          className="mt-4 flex items-center gap-3 rounded-xl border border-azul-500/20 bg-azul-300/15 px-4 py-3 text-[0.88rem] text-azul-600 transition-colors hover:bg-azul-300/25"
        >
          <Icone nome="calendario" className="h-[1.1rem] w-[1.1rem]" />
          <span className="min-w-0 flex-1">
            <span className="font-medium">“{proximo.titulo}”</span> entra no ar sozinho em{" "}
            {dataPorExtenso(proximo.entraNoAr)}.
          </span>
        </Link>
      )}

      {/* Filtros */}
      <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label="Filtrar artigos" className="inline-flex gap-1 rounded-xl bg-ink-900/[0.06] p-1">
            {ABAS.map((aba) => {
              const ativa = filtro === aba.valor;
              return (
                <button
                  key={aba.valor}
                  role="tab"
                  aria-selected={ativa}
                  onClick={() => setFiltro(aba.valor)}
                  className={`flex h-9 items-center gap-2 rounded-lg px-3.5 text-[0.86rem] font-medium whitespace-nowrap transition-all ${
                    ativa ? "bg-white text-text-strong shadow-[0_1px_3px_rgb(10_23_51/0.12)]" : "text-text-muted hover:text-text-strong"
                  }`}
                >
                  {aba.rotulo}
                  <span
                    className={`rounded-full px-1.5 text-[0.72rem] tabular-nums ${ativa ? "bg-ink-900 text-bone-50" : "bg-ink-900/[0.07]"}`}
                  >
                    {total[aba.valor]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="relative block md:w-72">
          <span className="sr-only">Buscar artigo</span>
          <Icone nome="busca" className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título ou autor…"
            className="painel-campo h-11 pl-10"
          />
        </label>
      </div>

      {/* Lista */}
      <div className="painel-cartao mt-4 overflow-hidden">
        {lista.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ink-900/[0.05] text-text-muted">
              <Icone nome="artigos" className="h-5 w-5" />
            </span>
            <p className="mx-auto mt-4 max-w-sm text-[0.92rem] text-text-muted">{VAZIO[filtro]}</p>
          </div>
        ) : (
          <ul className="divide-y divide-ink-900/[0.07]">
            {lista.map((i) => (
              <li key={i.id}>
                <Link
                  href={`/admin/artigos/${i.id}`}
                  className="group grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-4 px-4 py-3.5 transition-colors hover:bg-bone-100 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:px-5"
                >
                  <span className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink-900/[0.06]">
                    {i.capaLocal ? (
                      <Image src={i.capaLocal} alt="" fill sizes="96px" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-text-muted/50">
                        <Icone nome="imagem" className="h-5 w-5" />
                      </span>
                    )}
                  </span>

                  <span className="min-w-0">
                    <span className="line-clamp-2 text-[0.98rem] leading-snug font-medium text-text-strong group-hover:text-azul-600">
                      {i.titulo || "Sem título"}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.78rem] text-text-muted">
                      <Selo situacao={i.situacao} className="sm:hidden" />
                      {i.autor !== AUTOR_PADRAO && <span className="font-medium text-text-body">{getAutor(i.autor).nome}</span>}
                      {i.autor !== AUTOR_PADRAO && <span aria-hidden="true">·</span>}
                      {i.categoria && <span>{nomeDaCategoria(i.categoria)}</span>}
                      {i.categoria && <span aria-hidden="true">·</span>}
                      <span>{i.leitura} min de leitura</span>
                      <span aria-hidden="true" className="sm:hidden">
                        ·
                      </span>
                      <span className="sm:hidden">{legenda(i)}</span>
                    </span>
                  </span>

                  <span className="hidden flex-col items-end gap-1.5 text-right sm:flex">
                    <Selo situacao={i.situacao} />
                    <span className="text-[0.76rem] text-text-muted">{legenda(i)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function legenda(i: ItemDaLista) {
  if (i.situacao === "agendado") return `Para ${dataHora(i.entraNoAr)}`;
  if (i.situacao === "rascunho") return `Editado ${haQuanto(i.atualizado)}${i.atualizadoPor ? ` por ${i.atualizadoPor}` : ""}`;
  return `Publicado em ${dataCurta(i.publicado)}`;
}

function Numero({
  rotulo,
  valor,
  detalhe,
  tom,
}: {
  rotulo: string;
  valor: number;
  detalhe: string;
  tom: "verde" | "azul" | "cinza";
}) {
  const cor = { verde: "bg-emerald-500", azul: "bg-azul-500", cinza: "bg-text-muted/50" }[tom];
  return (
    <div className="painel-cartao p-4 md:p-5">
      <p className="flex items-center gap-2 text-[0.8rem] font-medium text-text-muted">
        <span className={`h-2 w-2 rounded-full ${cor}`} />
        {rotulo}
      </p>
      <p className="mt-2 text-[1.9rem] leading-none font-medium tracking-tight text-text-strong tabular-nums">{valor}</p>
      <p className="mt-2 truncate text-[0.76rem] text-text-muted">{detalhe}</p>
    </div>
  );
}
