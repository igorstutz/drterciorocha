"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { normalizar, pontuar } from "@/lib/busca";
import { ROTA_FORM_WHATSAPP, atributosGate } from "@/lib/whatsapp-gate";

export type ArtigoBusca = {
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string;
  publicado: string;
  data: string;
  leitura: number;
  capaLocal: string;
  termos: string;
};

const SUGESTOES = ["Alzheimer", "Joelho", "Longevidade", "Sexualidade", "Cabelo", "Esclerose múltipla"];

/** Alguma palavra buscada aparece no título ou na descrição? */
function citadoNaVitrine(a: ArtigoBusca, consulta: string) {
  const palavras = normalizar(consulta).split(" ").filter((p) => p.length >= 2);
  const vitrine = ` ${normalizar(`${a.titulo} ${a.descricao}`)}`;
  return palavras.some((p) => vitrine.includes(` ${p}`));
}

/** Destaca no texto as palavras buscadas (comparando sem acento). */
function destacar(texto: string, consulta: string): ReactNode {
  const palavras = normalizar(consulta).split(" ").filter((p) => p.length >= 2);
  if (!palavras.length) return texto;
  /* Palavra a palavra: cada uma é normalizada sozinha e comparada por
     prefixo, igual à busca, e o texto original é preservado com acentos. */
  const partes: ReactNode[] = [];
  const regex = /[\p{L}\p{N}]+/gu;
  let ultimo = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(texto))) {
    const palavra = m[0];
    const n = normalizar(palavra);
    if (palavras.some((p) => n.startsWith(p))) {
      partes.push(texto.slice(ultimo, m.index));
      partes.push(
        <mark key={m.index} className="rounded-[3px] bg-azul-300/45 px-0.5 text-inherit">
          {palavra}
        </mark>,
      );
      ultimo = m.index + palavra.length;
    }
  }
  if (!partes.length) return texto;
  partes.push(texto.slice(ultimo));
  return partes;
}

export function BuscaArtigos({
  artigos,
  categorias,
}: {
  artigos: ArtigoBusca[];
  categorias: { nome: string; total: number }[];
}) {
  const [consulta, setConsulta] = useState("");
  const [categoria, setCategoria] = useState("");
  const campo = useRef<HTMLInputElement>(null);

  /* ?q= e ?categoria= na URL: a busca pode ser compartilhada, e é o endereço
     declarado no SearchAction do schema.org. */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setConsulta(p.get("q") ?? "");
    setCategoria(p.get("categoria") ?? "");
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (consulta.trim()) p.set("q", consulta.trim());
    if (categoria) p.set("categoria", categoria);
    const qs = p.toString();
    const destino = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    if (destino !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, "", destino);
    }
  }, [consulta, categoria]);

  /* "/" foca a busca, como em sites de documentação. */
  useEffect(() => {
    function atalho(e: KeyboardEvent) {
      const alvo = e.target as HTMLElement;
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName)) {
        e.preventDefault();
        campo.current?.focus();
      }
    }
    window.addEventListener("keydown", atalho);
    return () => window.removeEventListener("keydown", atalho);
  }, []);

  const filtrando = Boolean(consulta.trim() || categoria);

  const resultados = useMemo(() => {
    const lista = artigos
      .filter((a) => !categoria || a.categoria === categoria)
      .map((a) => ({ a, nota: pontuar(a, consulta) }))
      .filter((r) => r.nota > 0);
    if (consulta.trim()) lista.sort((x, y) => y.nota - x.nota);
    return lista.map((r) => r.a);
  }, [artigos, consulta, categoria]);

  const [principal, ...resto] = resultados;
  const mostrarDestaque = !filtrando && principal;
  const grade = mostrarDestaque ? resto : resultados;

  function limpar() {
    setConsulta("");
    setCategoria("");
    campo.current?.focus();
  }

  return (
    <>
      {/* ================= BUSCA ================= */}
      <div className="relative z-20 -mt-10 md:-mt-12">
        <div className="u-container">
          <div className="rounded-card border border-ink-900/10 bg-bone-50 p-5 shadow-[0_30px_70px_-35px_rgb(10_23_51/0.5)] md:p-7">
            <form role="search" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="busca-artigos" className="sr-only">
                Buscar nos artigos
              </label>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 stroke-text-muted"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  ref={campo}
                  id="busca-artigos"
                  type="search"
                  value={consulta}
                  onChange={(e) => setConsulta(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setConsulta("")}
                  placeholder="Busque por um tema: joelho, Alzheimer, longevidade…"
                  autoComplete="off"
                  className="w-full rounded-btn border border-ink-900/15 bg-bone-100 py-4 pl-14 pr-28 text-[1.02rem] text-text-strong outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-text-muted/70 focus:border-azul-500 focus:shadow-[0_0_0_4px_rgb(53_103_196/0.14)] [&::-webkit-search-cancel-button]:hidden"
                />
                {consulta ? (
                  <button
                    type="button"
                    onClick={() => {
                      setConsulta("");
                      campo.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-[0.8rem] font-medium text-text-muted transition-colors hover:bg-bone-200 hover:text-text-strong"
                  >
                    Limpar
                  </button>
                ) : (
                  <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-ink-900/15 bg-bone-50 px-2 py-0.5 font-sans text-[0.75rem] text-text-muted md:block">
                    /
                  </kbd>
                )}
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[0.8rem] text-text-muted">Sugestões:</span>
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setConsulta(s)}
                  className="rounded-chip border border-ink-900/12 px-3 py-1 text-[0.8rem] text-text-body transition-colors hover:border-azul-400/60 hover:bg-azul-300/15 hover:text-ink-900"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-5 border-t border-ink-900/8 pt-5">
              <p className="sr-only" id="rotulo-categorias">
                Filtrar por categoria
              </p>
              <div role="group" aria-labelledby="rotulo-categorias" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible">
                {[{ nome: "", total: artigos.length }, ...categorias].map((c) => {
                  const ativo = categoria === c.nome;
                  return (
                    <button
                      key={c.nome || "todos"}
                      type="button"
                      aria-pressed={ativo}
                      onClick={() => setCategoria(c.nome)}
                      className={`shrink-0 whitespace-nowrap rounded-chip px-4 py-2 text-[0.82rem] font-medium transition-colors ${
                        ativo
                          ? "bg-ink-900 text-bone-50"
                          : "bg-bone-200/70 text-text-body hover:bg-bone-200 hover:text-ink-900"
                      }`}
                    >
                      {c.nome || "Todos"}{" "}
                      <span className={ativo ? "text-bone-100/60" : "text-text-muted/70"}>{c.total}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p aria-live="polite" className="mt-7 text-[0.92rem] text-text-muted">
            {filtrando ? (
              <>
                <strong className="font-semibold text-text-strong">
                  {resultados.length} {resultados.length === 1 ? "artigo" : "artigos"}
                </strong>
                {consulta.trim() && <> para “{consulta.trim()}”</>}
                {categoria && <> em {categoria}</>}
                {" · "}
                <button type="button" onClick={limpar} className="font-medium text-azul-600 underline underline-offset-4 hover:text-ink-900">
                  limpar filtros
                </button>
              </>
            ) : (
              <>
                <strong className="font-semibold text-text-strong">{artigos.length} artigos</strong>, do
                mais recente ao mais antigo
              </>
            )}
          </p>
        </div>
      </div>

      {/* ================= DESTAQUE ================= */}
      {mostrarDestaque && (
        <section className="pt-8">
          <div className="u-container">
            <Link
              href={`/artigos/${principal.slug}`}
              className="group grid overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 transition-[box-shadow,border-color] duration-500 hover:border-azul-400/45 hover:shadow-lift-hover lg:grid-cols-2"
            >
              {principal.capaLocal && (
                <div className="relative aspect-16/10 overflow-hidden lg:aspect-auto lg:min-h-[24rem]">
                  <Image
                    src={principal.capaLocal}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="flex items-center gap-3">
                  <span className="rounded-chip bg-azul-500 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-bone-50">
                    Mais recente
                  </span>
                  <span className="u-eyebrow text-gold-700">{principal.categoria}</span>
                </div>
                <h2 className="mt-5 text-title transition-colors group-hover:text-azul-600">
                  {principal.titulo}
                </h2>
                <p className="mt-4 text-[1rem] leading-relaxed text-text-body">{principal.descricao}</p>
                <p className="mt-6 text-[0.82rem] text-text-muted">
                  {principal.data} · {principal.leitura} min de leitura
                </p>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ================= GRADE ================= */}
      <section className="pb-16 pt-8 md:pb-20">
        <div className="u-container">
          {grade.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {grade.map((a) => (
                <Link
                  key={a.slug}
                  href={`/artigos/${a.slug}`}
                  className="group flex flex-col overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-azul-400/45 hover:shadow-lift-hover"
                >
                  {a.capaLocal ? (
                    <div className="relative aspect-16/10 overflow-hidden">
                      <Image
                        src={a.capaLocal}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-16/10 bg-gradient-to-br from-ink-800 to-azul-900" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="u-eyebrow text-gold-700">{a.categoria}</span>
                    <h2 className="mt-3 text-[1.18rem] leading-tight transition-colors group-hover:text-azul-600">
                      {destacar(a.titulo, consulta)}
                    </h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-[0.91rem] leading-relaxed text-text-body">
                      {destacar(a.descricao, consulta)}
                    </p>
                    {consulta.trim() && !citadoNaVitrine(a, consulta) && (
                      <p className="mt-4 flex items-center gap-1.5 text-[0.78rem] font-medium text-azul-600">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 stroke-current" fill="none" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                          <circle cx="11" cy="11" r="7" />
                          <path d="m20 20-3.5-3.5" />
                        </svg>
                        Citado no texto do artigo
                      </p>
                    )}
                    <time dateTime={a.publicado} className="mt-5 text-[0.78rem] text-text-muted">
                      {a.data} · {a.leitura} min
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-dashed border-ink-900/20 bg-bone-50 px-6 py-14 text-center md:py-20">
              <p className="text-[1.25rem] font-medium tracking-tight text-text-strong">
                Nenhum artigo encontrado
                {consulta.trim() && <> para “{consulta.trim()}”</>}
              </p>
              <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-text-body">
                Tente outra palavra, como o nome de uma doença ou de uma parte do corpo.
                Se preferir, pergunte direto para a equipe.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={limpar}
                  className="rounded-btn border border-ink-900/18 px-6 py-3 text-[0.88rem] font-semibold text-text-strong transition-colors hover:border-azul-400/60"
                >
                  Ver todos os artigos
                </button>
                <Link
                  href={ROTA_FORM_WHATSAPP}
                  {...atributosGate({ local: "artigos-busca-vazia" })}
                  className="rounded-btn bg-ink-900 px-6 py-3 text-[0.88rem] font-semibold text-bone-50 transition-colors hover:bg-ink-700"
                >
                  Perguntar à equipe
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
