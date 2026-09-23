import { Marked } from "marked";

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
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
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
