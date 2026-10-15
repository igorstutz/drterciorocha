import { Marked, type Token, type TokensList } from "marked";

/** Slug para âncoras de subtítulo (sem acento, minúsculo, hífens). */
function ancora(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Os artigos do Dr. Tércio são, em boa parte, crônicas de consultório: falas com
 * travessão e pensamentos entre aspas e em itálico. A classe deixa a página tratar
 * cada um como linguagem editorial, sem mexer no texto.
 */
export function tipoDoParagrafo(texto: string): "fala" | "pensamento" | "" {
  const t = texto.trim();
  if (/^[–—]\s/.test(t)) return "fala";
  if (/^[“"]\s*[_*]/.test(t) || /^[_*]\s*[“"]/.test(t)) return "pensamento";
  return "";
}

/**
 * Renderização no build (Server Component): nenhum parser de markdown chega ao
 * navegador. `html: false` descarta HTML bruto do markdown importado do
 * WordPress, então nada de <script> herdado do conteúdo antigo.
 */
const marked = new Marked({
  gfm: true,
  breaks: false,
  async: false,
});

marked.use({
  renderer: {
    // Links externos sempre em nova aba e sem passar reputação.
    link({ href, title, tokens }) {
      const texto = this.parser.parseInline(tokens);
      const externo = /^https?:\/\//.test(href) && !href.includes("drterciorocha.com");
      const attrs = [
        `href="${href}"`,
        title ? `title="${title}"` : "",
        externo ? 'target="_blank" rel="noopener noreferrer nofollow"' : "",
      ]
        .filter(Boolean)
        .join(" ");
      return `<a ${attrs}>${texto}</a>`;
    },
    // As imagens internas do corpo já foram baixadas; as remanescentes ficam lazy.
    image({ href, title, text }) {
      return `<img src="${href}" alt="${text ?? ""}"${
        title ? ` title="${title}"` : ""
      } loading="lazy" decoding="async" />`;
    },
    paragraph({ tokens, text }) {
      const html = this.parser.parseInline(tokens);
      const tipo = tipoDoParagrafo(text);
      if (tipo === "fala") {
        const sem = html.replace(/^\s*[–—]\s*/, "");
        return `<p class="fala"><span class="travessao">–</span>${sem}</p>\n`;
      }
      // "“ _Mudança de casa…_”": a aspa de abertura gruda no texto.
      if (tipo === "pensamento") return `<p class="pensamento">${html.replace(/^([“"])\s+/, "$1")}</p>\n`;
      return `<p>${html}</p>\n`;
    },
    heading({ tokens, depth, text }) {
      const html = this.parser.parseInline(tokens);
      return `<h${depth} id="${ancora(text)}">${html}</h${depth}>\n`;
    },
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

export interface ArtigoRenderizado {
  /** Até a pausa no meio do texto (onde entra a chamada para a consulta). */
  antes: string;
  /** Depois da pausa; vazio quando o texto é curto demais para dividir. */
  depois: string;
  /** Subtítulos (h2) para o índice lateral. */
  titulos: { id: string; texto: string }[];
}

/**
 * Renderiza o corpo e o divide perto do meio, num ponto que não corte um diálogo
 * ao meio (o bloco seguinte não é uma fala). Só divide com 10 blocos ou mais.
 */
export function renderArtigo(md: string): ArtigoRenderizado {
  const tokens = marked.lexer(md);
  const titulos = tokens
    .filter((t): t is Token & { type: "heading"; depth: number; text: string } => t.type === "heading" && (t as { depth: number }).depth === 2)
    .map((t) => ({ id: ancora(t.text), texto: t.text.replace(/[*_]/g, "") }));

  const blocos = tokens.map((t, i) => ({ t, i })).filter(({ t }) => t.type !== "space");
  const parse = (lista: Token[]) => {
    const l = lista as TokensList;
    l.links = tokens.links;
    return marked.parser(l);
  };
  if (blocos.length < 10) return { antes: parse(tokens), depois: "", titulos };

  const total = blocos.reduce((s, b) => s + b.t.raw.length, 0);
  let soma = 0;
  let corte = -1;
  for (let k = 0; k < blocos.length - 3; k++) {
    soma += blocos[k].t.raw.length;
    if (soma < total * 0.42 || k < 4) continue;
    const prox = blocos[k + 1].t;
    const proxTexto = prox.type === "paragraph" ? (prox as { text: string }).text : "";
    if (blocos[k].t.type === "paragraph" && prox.type === "paragraph" && tipoDoParagrafo(proxTexto) !== "fala") {
      corte = blocos[k + 1].i;
      break;
    }
  }
  if (corte < 0) return { antes: parse(tokens), depois: "", titulos };
  return { antes: parse(tokens.slice(0, corte)), depois: parse(tokens.slice(corte)), titulos };
}

/**
 * Primeiro parágrafo em texto puro — usado como resumo quando a meta
 * description do WordPress vinha vazia (eram 9 páginas).
 */
export function resumo(md: string, limite = 165) {
  const texto = md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (texto.length <= limite) return texto;
  const corte = texto.slice(0, limite);
  return corte.slice(0, corte.lastIndexOf(" ")) + "…";
}
