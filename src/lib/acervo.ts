import "server-only";
import fs from "node:fs";
import path from "node:path";
import semente from "@/content/artigos/artigos.json";

/**
 * O acervo de artigos, lido e gravado em disco para o painel (/admin) poder publicar sem build.
 *
 * Na VPS, `DADOS_DIR` aponta para um volume do Docker (ver deploy/docker-compose.vps.yml), que
 * sobrevive a cada nova publicação do site. Enquanto `dados/artigos.json` não existe, o acervo é
 * o `src/content/artigos/artigos.json` migrado do WordPress; a primeira gravação do painel copia
 * tudo para o volume, e dali em diante é ele que vale. Cada gravação guarda a versão anterior em
 * `dados/historico/` (as 60 mais recentes) — é o desfazer de um artigo apagado por engano.
 */

export type Status = "publicado" | "rascunho";

export type ArtigoGuardado = {
  /** Fixo: o slug pode mudar enquanto o artigo é rascunho, o id não. Os migrados usam o slug. */
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string;
  /** ISO. A data que o artigo mostra. Com `status: "publicado"` e sem `noArEm`, uma data no futuro é um agendamento. */
  publicado: string;
  /**
   * Quando o artigo entra no ar, se for diferente da data que ele mostra. É o agendamento de um
   * artigo que já tem data própria (os migrados do stemcells mantêm a de lá mesmo indo ao ar depois).
   */
  noArEm?: string;
  atualizado: string;
  /** URL original da capa no WordPress (só os migrados). */
  capa: string;
  capaLocal: string;
  urlAntiga: string;
  palavras: number;
  corpo: string;
  status: Status;
  /** Slug em src/content/autores.ts. Sem ele, o autor é o Dr. Tércio. */
  autor?: string;
  /** O que mudou numa revisão feita fora do painel (ex.: a migração do stemcells), mostrado no editor. */
  notasRevisao?: string[];
  /** O que ainda depende de confirmação antes de publicar. */
  pendencias?: string[];
  criadoPor?: string;
  atualizadoPor?: string;
};

export const DIR_DADOS = process.env.DADOS_DIR || path.join(process.cwd(), "dados");
export const DIR_MIDIA = path.join(DIR_DADOS, "midia");
const ARQUIVO = path.join(DIR_DADOS, "artigos.json");
const HISTORICO = path.join(DIR_DADOS, "historico");
const VERSOES_GUARDADAS = 60;

const daSemente: ArtigoGuardado[] = semente.map((a) => ({
  ...a,
  id: a.slug,
  palavras: Number(a.palavras) || 0,
  status: "publicado",
}));

/* Releitura só quando o arquivo muda: cada página do site consulta o acervo. */
let cache: { mtime: number; lista: ArtigoGuardado[] } | null = null;

export function lerAcervo(): ArtigoGuardado[] {
  let mtime: number;
  try {
    mtime = fs.statSync(ARQUIVO).mtimeMs;
  } catch {
    return daSemente;
  }
  if (cache?.mtime === mtime) return cache.lista;
  const lista = JSON.parse(fs.readFileSync(ARQUIVO, "utf8")) as ArtigoGuardado[];
  cache = { mtime, lista };
  return lista;
}

/**
 * Grava o acervo inteiro. Síncrono de propósito: quem lê, altera e grava sem `await` no meio não
 * corre o risco de duas gravações do painel se atropelarem no mesmo processo.
 */
export function gravarAcervo(lista: ArtigoGuardado[]) {
  fs.mkdirSync(HISTORICO, { recursive: true });
  if (fs.existsSync(ARQUIVO)) {
    const carimbo = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(ARQUIVO, path.join(HISTORICO, `artigos-${carimbo}.json`));
    const antigas = fs
      .readdirSync(HISTORICO)
      .filter((f) => f.startsWith("artigos-"))
      .sort()
      .slice(0, -VERSOES_GUARDADAS);
    for (const f of antigas) fs.rmSync(path.join(HISTORICO, f), { force: true });
  }
  const temporario = `${ARQUIVO}.${process.pid}.tmp`;
  fs.writeFileSync(temporario, JSON.stringify(lista, null, 2));
  fs.renameSync(temporario, ARQUIVO);
  cache = { mtime: fs.statSync(ARQUIVO).mtimeMs, lista };
}

/** O momento em que o artigo entra (ou entrou) no ar. */
export function momentoNoAr(a: ArtigoGuardado) {
  return a.noArEm || a.publicado;
}

/** No ar: publicado e com o momento de entrar no ar já alcançado. */
export function estaNoAr(a: ArtigoGuardado, agora = Date.now()) {
  const quando = momentoNoAr(a);
  return a.status === "publicado" && !!quando && Date.parse(quando) <= agora;
}

export function situacao(a: ArtigoGuardado, agora = Date.now()): "publicado" | "agendado" | "rascunho" {
  if (a.status === "rascunho") return "rascunho";
  return estaNoAr(a, agora) ? "publicado" : "agendado";
}
