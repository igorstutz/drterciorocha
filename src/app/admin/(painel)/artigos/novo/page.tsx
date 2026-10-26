import { lerAcervo } from "@/lib/acervo";
import { exigirUsuario } from "@/lib/painel/sessao";
import { EditorArtigo } from "@/components/painel/EditorArtigo";

export const metadata = { title: "Novo artigo" };

export default async function NovoArtigo() {
  await exigirUsuario();
  const categorias = [...new Set(lerAcervo().map((a) => a.categoria).filter(Boolean))].sort();
  return <EditorArtigo inicial={null} categorias={categorias} />;
}
