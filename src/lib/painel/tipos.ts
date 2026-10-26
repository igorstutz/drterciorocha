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
  /** A data que o artigo mostra no site. */
  publicado: string;
  /** Quando entra (ou entrou) no ar: igual a `publicado`, salvo no agendamento de artigo com data própria. */
  entraNoAr: string;
  atualizado: string;
  atualizadoPor: string;
  situacao: Situacao;
  /** Depois de ir ao ar, o endereço não muda mais: o Google e quem compartilhou já o conhecem. */
  slugTravado: boolean;
  notasRevisao: string[];
  pendencias: string[];
  /** De onde o artigo veio, quando foi migrado (ex.: o endereço no stemcells.com.br). */
  urlAntiga: string;
};

export type Resultado =
  | { ok: true; artigo: ArtigoNoEditor }
  | { ok: false; erro: string; campo?: keyof EntradaArtigo };
