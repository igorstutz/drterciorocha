import { lerAcervo, momentoNoAr, situacao } from "@/lib/acervo";
import { exigirUsuario } from "@/lib/painel/sessao";
import { minutosDeLeitura } from "@/lib/slug";
import { getAutor } from "@/content/autores";
import { ListaArtigos, type ItemDaLista } from "@/components/painel/ListaArtigos";

export const metadata = { title: "Artigos" };

export default async function Painel() {
  const usuario = await exigirUsuario();
  const agora = Date.now();
  /* Sem o corpo: a lista só precisa do resumo de cada artigo. */
  const itens: ItemDaLista[] = lerAcervo().map((a) => ({
    id: a.id,
    slug: a.slug,
    titulo: a.titulo,
    categoria: a.categoria,
    capaLocal: a.capaLocal,
    situacao: situacao(a, agora),
    publicado: a.publicado,
    entraNoAr: momentoNoAr(a),
    atualizado: a.atualizado,
    atualizadoPor: a.atualizadoPor ?? "",
    autor: getAutor(a.autor).slug,
    leitura: minutosDeLeitura(a.palavras),
  }));

  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hourCycle: "h23", timeZone: "America/Sao_Paulo" }).format(agora),
  );
  const saudacao = `${hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite"}, ${usuario.nome.split(" ")[0]}`;

  return <ListaArtigos itens={itens} saudacao={saudacao} />;
}
