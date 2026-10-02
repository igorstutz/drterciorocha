/**
 * Busca dos artigos. Roda no navegador, sem servidor (a prévia é estática).
 *
 * Para achar termos que só aparecem no meio do texto sem mandar os 176 mil
 * caracteres dos artigos para o navegador, o build guarda de cada corpo apenas
 * o conjunto de palavras distintas. A busca compara por prefixo: "celula"
 * encontra "células", "joelh" encontra "joelho" e "joelhos".
 */

/** Minúsculas, sem acento e sem pontuação: "Células-Tronco" → "celulas tronco". */
export function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/* Palavras que não ajudam a achar nada. */
const VAZIAS = new Set(
  "para pela pelo pelos pelas como mais mas sem com que uma umas uns por dos das nos nas aos sua seu suas seus ele ela eles elas isso esse essa este esta isto aqui ali entao tambem quando onde muito muita muitos muitas pode podem ser sao era foi tem ter todo toda todos todas ainda depois antes sobre entre cada mesmo mesma voce voces nao sim".split(
    " ",
  ),
);

/** Palavras distintas de um texto, para o índice do corpo. */
export function palavrasDistintas(texto: string) {
  const unicas = new Set<string>();
  for (const p of normalizar(texto).split(" ")) {
    if (p.length >= 4 && !VAZIAS.has(p)) unicas.add(p);
  }
  return [...unicas].join(" ");
}

export type ItemBusca = {
  titulo: string;
  descricao: string;
  categoria: string;
  /** palavras distintas do corpo, separadas por espaço */
  termos: string;
};

/**
 * Pontua um artigo para a busca. Todas as palavras digitadas precisam aparecer
 * em algum lugar. Título vale mais que descrição, que vale mais que o corpo.
 * Retorna 0 quando não combina.
 */
export function pontuar(item: ItemBusca, consulta: string) {
  const palavras = normalizar(consulta)
    .split(" ")
    .filter((p) => p.length >= 2 && !VAZIAS.has(p));
  if (!palavras.length) return 1;

  const titulo = ` ${normalizar(item.titulo)}`;
  const resto = ` ${normalizar(`${item.descricao} ${item.categoria}`)}`;
  const corpo = ` ${item.termos}`;

  let total = 0;
  for (const p of palavras) {
    const inicio = ` ${p}`;
    if (titulo.includes(inicio)) total += 6;
    else if (resto.includes(inicio)) total += 3;
    else if (corpo.includes(inicio)) total += 1;
    else return 0;
  }
  return total;
}
