/** "Células-tronco e Regeneração" → "celulas-tronco-e-regeneracao". Serve ao site e ao painel. */
export function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Palavras do corpo em markdown, sem contar a sintaxe (imagens, links, marcações). */
export function contarPalavras(md: string) {
  const texto = md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`~|-]/g, " ")
    .trim();
  return texto ? texto.split(/\s+/).length : 0;
}

/** 200 palavras/minuto é a média de leitura em português. */
export function minutosDeLeitura(palavras: number) {
  return Math.max(1, Math.round(palavras / 200));
}

/** "CÉLULAS-TRONCO" → "Células-tronco": as categorias vieram em caixa alta do WordPress. */
export function nomeDaCategoria(c: string) {
  const t = c.toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}
