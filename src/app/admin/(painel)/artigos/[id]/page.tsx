import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lerAcervo } from "@/lib/acervo";
import { exigirUsuario } from "@/lib/painel/sessao";
import { paraEditor } from "@/lib/painel/editor";
import { EditorArtigo } from "@/components/painel/EditorArtigo";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const a = lerAcervo().find((x) => x.id === decodeURIComponent(id));
  return { title: a?.titulo || "Artigo" };
}

export default async function EditarArtigo({ params }: Props) {
  await exigirUsuario();
  const { id } = await params;
  const acervo = lerAcervo();
  const artigo = acervo.find((a) => a.id === decodeURIComponent(id));
  if (!artigo) notFound();

  const categorias = [...new Set(acervo.map((a) => a.categoria).filter(Boolean))].sort();
  /* key: abrir outro artigo pelo histórico do navegador remonta o editor com o conteúdo certo. */
  return <EditorArtigo key={artigo.id} inicial={paraEditor(artigo)} categorias={categorias} />;
}
