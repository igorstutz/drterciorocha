import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArtigo, getArtigos, getRelacionados } from "@/lib/artigos";
import { resumo } from "@/lib/markdown";
import { doctor } from "@/content/site";
import { ArtigoCompleto } from "@/components/ArtigoCompleto";

/* Regenera a cada minuto: é assim que um artigo agendado no painel entra no ar na hora marcada. */
export const revalidate = 60;

export function generateStaticParams() {
  return getArtigos().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArtigo(slug);
  if (!a) return {};

  /* Nove páginas do site antigo não tinham meta description; aqui o primeiro
     parágrafo entra no lugar em vez de deixar o campo vazio. */
  const descricao = a.descricao || resumo(a.corpo);

  return {
    title: a.titulo,
    description: descricao,
    alternates: { canonical: `/artigos/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.titulo,
      description: descricao,
      url: `/artigos/${a.slug}`,
      publishedTime: a.publicado || undefined,
      modifiedTime: a.atualizado || undefined,
      authors: [doctor.name],
      images: a.capaLocal ? [{ url: a.capaLocal, alt: a.titulo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: a.titulo,
      description: descricao,
      images: a.capaLocal ? [a.capaLocal] : undefined,
    },
  };
}

export default async function Artigo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = getArtigo(slug);
  if (!artigo) notFound();

  return <ArtigoCompleto artigo={artigo} relacionados={getRelacionados(slug)} />;
}
