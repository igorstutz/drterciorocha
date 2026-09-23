import dados from "@/content/artigos/artigos.json";

export type Artigo = {
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string;
  publicado: string;
  atualizado: string;
  capa: string;
  capaLocal: string;
  urlAntiga: string;
  palavras: number;
  corpo: string;
  leitura: number;
};

/** 200 palavras/minuto é a média de leitura em português. */
function minutos(palavras: number) {
  return Math.max(1, Math.round(palavras / 200));
}

const artigos: Artigo[] = (dados as Omit<Artigo, "leitura">[])
  .map((a) => ({ ...a, leitura: minutos(a.palavras) }))
  .sort((a, b) => (b.publicado || "").localeCompare(a.publicado || ""));

export function getArtigos() {
  return artigos;
}

export function getArtigo(slug: string) {
  return artigos.find((a) => a.slug === slug);
}

export function getCategorias() {
  const mapa = new Map<string, number>();
  artigos.forEach((a) => mapa.set(a.categoria, (mapa.get(a.categoria) ?? 0) + 1));
  return [...mapa.entries()]
    .map(([nome, total]) => ({ nome, total, slug: slugify(nome) }))
    .sort((a, b) => b.total - a.total);
}

export function getRelacionados(slug: string, limite = 3) {
  const atual = getArtigo(slug);
  if (!atual) return [];
  const mesmaCategoria = artigos.filter(
    (a) => a.slug !== slug && a.categoria === atual.categoria,
  );
  const resto = artigos.filter(
    (a) => a.slug !== slug && a.categoria !== atual.categoria,
  );
  return [...mesmaCategoria, ...resto].slice(0, limite);
}

export function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatarData(iso: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
