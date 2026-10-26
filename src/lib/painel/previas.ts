import "server-only";
import { randomBytes } from "node:crypto";
import type { ArtigoGuardado } from "@/lib/acervo";

/**
 * Pré-visualizações em memória: o editor manda o que está na tela (salvo ou não), recebe um código
 * e abre /admin/previa/<código>. Duram uma hora; reiniciar o site as apaga, o que não faz falta.
 */
const VALIDADE_MS = 60 * 60 * 1000;
const global = globalThis as typeof globalThis & {
  __painelPrevias?: Map<string, { artigo: ArtigoGuardado; ate: number }>;
};
const previas = (global.__painelPrevias ??= new Map());

export function guardarPrevia(artigo: ArtigoGuardado) {
  const agora = Date.now();
  for (const [codigo, p] of previas) if (p.ate < agora) previas.delete(codigo);
  const codigo = randomBytes(12).toString("base64url");
  previas.set(codigo, { artigo, ate: agora + VALIDADE_MS });
  return codigo;
}

export function lerPrevia(codigo: string): ArtigoGuardado | null {
  const p = previas.get(codigo);
  return p && p.ate > Date.now() ? p.artigo : null;
}
