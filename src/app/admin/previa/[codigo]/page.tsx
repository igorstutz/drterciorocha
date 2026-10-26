import { notFound } from "next/navigation";
import { exigirUsuario } from "@/lib/painel/sessao";
import { lerPrevia } from "@/lib/painel/previas";
import { getArtigos } from "@/lib/artigos";
import { minutosDeLeitura } from "@/lib/slug";
import { ChromeDoSite } from "@/components/ChromeDoSite";
import { ArtigoCompleto } from "@/components/ArtigoCompleto";

export const metadata = { title: "Pré-visualização" };

/* O artigo como vai ficar no site, com o que estava na tela do editor (salvo ou não). */
export default async function Previa({ params }: { params: Promise<{ codigo: string }> }) {
  await exigirUsuario();
  const { codigo } = await params;
  const guardado = lerPrevia(codigo);
  if (!guardado) notFound();

  const artigo = {
    ...guardado,
    capaLocal: guardado.capaLocal || "/img/banner-hero.png",
    leitura: minutosDeLeitura(guardado.palavras),
  };
  const relacionados = getArtigos()
    .filter((a) => a.slug !== artigo.slug)
    .sort((a, b) => Number(b.categoria === artigo.categoria) - Number(a.categoria === artigo.categoria))
    .slice(0, 3);

  return (
    <>
      <div className="fixed inset-x-0 bottom-4 z-[90] flex justify-center px-4">
        <p className="flex items-center gap-2.5 rounded-full bg-gold-500 px-5 py-2.5 text-[0.85rem] font-medium text-ink-900 shadow-[0_12px_30px_-8px_rgb(10_23_51/0.5)]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-ink-900" />
          Pré-visualização: só você está vendo esta página
        </p>
      </div>
      <ChromeDoSite rastrear={false}>
        <ArtigoCompleto artigo={artigo} relacionados={relacionados} />
      </ChromeDoSite>
    </>
  );
}
