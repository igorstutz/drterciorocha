import { lerAcervo, estaNoAr, type ArtigoGuardado } from "@/lib/acervo";
import { minutosDeLeitura, slugify } from "@/lib/slug";

export { slugify };

export type Artigo = ArtigoGuardado & { leitura: number };

/**
 * Os artigos no ar, do mais novo para o mais antigo. Lidos do acervo a cada chamada: rascunhos e
 * agendamentos ainda no futuro ficam de fora. As páginas que listam artigos regeneram a cada
 * minuto (`revalidate = 60`), e é isso que faz um agendamento aparecer sozinho na hora marcada.
 */
export function getArtigos(): Artigo[] {
  const agora = Date.now();
  return lerAcervo()
    .filter((a) => estaNoAr(a, agora))
    .map((a) => ({ ...a, leitura: minutosDeLeitura(a.palavras) }))
    .sort((a, b) => Date.parse(b.publicado) - Date.parse(a.publicado));
}

export function getArtigo(slug: string) {
  return getArtigos().find((a) => a.slug === slug);
}

export function getCategorias() {
  const artigos = getArtigos();
  const mapa = new Map<string, number>();
  artigos.forEach((a) => mapa.set(a.categoria, (mapa.get(a.categoria) ?? 0) + 1));
  return [...mapa.entries()]
    .map(([nome, total]) => ({ nome, total, slug: slugify(nome) }))
    .sort((a, b) => b.total - a.total);
}

export function getRelacionados(slug: string, limite = 3) {
  const artigos = getArtigos();
  const atual = artigos.find((a) => a.slug === slug);
  if (!atual) return [];
  const mesmaCategoria = artigos.filter(
    (a) => a.slug !== slug && a.categoria === atual.categoria,
  );
  const resto = artigos.filter(
    (a) => a.slug !== slug && a.categoria !== atual.categoria,
  );
  return [...mesmaCategoria, ...resto].slice(0, limite);
}

export function formatarData(iso: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
}
