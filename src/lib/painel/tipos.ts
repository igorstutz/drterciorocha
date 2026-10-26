/* Tipos que o editor (navegador) e as ações do painel (servidor) compartilham. */

export type Situacao = "publicado" | "agendado" | "rascunho";

/** O que o editor manda ao salvar. `versao` é o `atualizado` de quando o artigo foi aberto. */
export type EntradaArtigo = {
  id?: string;
  versao?: string;
  titulo: string;
  descricao: string;
  categoria: string;
  slug: string;
  capaLocal: string;
  corpo: string;
  /** Slug do autor (src/content/autores.ts). */
  autor: string;
  /** ISO; só vale para agendar. */
  publicarEm?: string;
};

/**
 * - `rascunho`: guarda sem pôr no ar (e tira do ar, se estava).
 * - `publicar`: põe no ar agora.
 * - `agendar`: põe no ar sozinho em `publicarEm`.
 * - `salvar`: grava alterações de um artigo já publicado ou agendado, sem mudar a situação.
 */
export type Acao = "rascunho" | "publicar" | "agendar" | "salvar";

export type ArtigoNoEditor = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string;
  capaLocal: string;
  corpo: string;
  autor: string;
  publicado: string;
  atualizado: string;
  atualizadoPor: string;
  situacao: Situacao;
  /** Depois de ir ao ar, o endereço não muda mais: o Google e quem compartilhou já o conhecem. */
  slugTravado: boolean;
};

export type Resultado =
  | { ok: true; artigo: ArtigoNoEditor }
  | { ok: false; erro: string; campo?: keyof EntradaArtigo };
