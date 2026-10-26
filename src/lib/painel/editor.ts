import "server-only";
import { estaNoAr, momentoNoAr, situacao, type ArtigoGuardado } from "@/lib/acervo";
import type { ArtigoNoEditor } from "@/lib/painel/tipos";
import { getAutor } from "@/content/autores";

export function paraEditor(a: ArtigoGuardado): ArtigoNoEditor {
  return {
    id: a.id,
    slug: a.slug,
    titulo: a.titulo,
    descricao: a.descricao,
    categoria: a.categoria,
    capaLocal: a.capaLocal,
    corpo: a.corpo,
    autor: getAutor(a.autor).slug,
    publicado: a.publicado,
    entraNoAr: momentoNoAr(a),
    atualizado: a.atualizado,
    atualizadoPor: a.atualizadoPor ?? "",
    situacao: situacao(a),
    slugTravado: estaNoAr(a),
    notasRevisao: a.notasRevisao ?? [],
    pendencias: a.pendencias ?? [],
    urlAntiga: a.urlAntiga ?? "",
  };
}
