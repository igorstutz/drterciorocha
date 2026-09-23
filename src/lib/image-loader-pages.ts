/**
 * Loader de imagem da prévia no GitHub Pages. Sem servidor não há otimização:
 * devolve o arquivo original, prefixado com o basePath (o next/image não o
 * aplica sozinho em `src` string). O `w` só existe para o Next não reclamar
 * de loader que ignora a largura.
 */
export default function imageLoaderPages({ src, width }: { src: string; width: number }) {
  if (!src.startsWith("/")) return src;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}?w=${width}`;
}
