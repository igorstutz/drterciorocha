import type { Metadata } from "next";
import { getArtigos, getCategorias, formatarData } from "@/lib/artigos";
import { palavrasDistintas } from "@/lib/busca";
import { Badge, Breadcrumbs, Button } from "@/components/ui";
import { BuscaArtigos } from "@/components/BuscaArtigos";
import { JsonLd, graph, breadcrumbSchema } from "@/lib/jsonld";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Artigos e casos sobre células-tronco",
  description:
    "Casos reais e reflexões sobre medicina regenerativa, células-tronco e longevidade, escritos pelo Dr. Tércio Rocha.",
  alternates: { canonical: "/artigos" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "Artigos", url: "/artigos" },
];

export default function Artigos() {
  const artigos = getArtigos();
  const categorias = getCategorias().map(({ nome, total }) => ({ nome, total }));

  /* Só o necessário para a lista e a busca: o corpo vai como palavras
     distintas (ver lib/busca), não como texto inteiro. */
  const itens = artigos.map((a) => ({
    slug: a.slug,
    titulo: a.titulo,
    descricao: a.descricao,
    categoria: a.categoria,
    publicado: a.publicado,
    data: formatarData(a.publicado),
    leitura: a.leitura,
    capaLocal: a.capaLocal,
    termos: palavrasDistintas(a.corpo),
  }));

  const listaSchema = {
    "@type": "Blog",
    "@id": `${site.url}/artigos#blog`,
    name: "Artigos do Dr. Tércio Rocha",
    description:
      "Casos reais e reflexões sobre medicina regenerativa, células-tronco e longevidade.",
    url: `${site.url}/artigos`,
    inLanguage: site.locale,
    blogPost: artigos.slice(0, 20).map((a) => ({
      "@type": "BlogPosting",
      headline: a.titulo,
      url: `${site.url}/artigos/${a.slug}`,
      datePublished: a.publicado || undefined,
      author: { "@id": `${site.url}/#pessoa` },
    })),
  };

  return (
    <>
      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 pt-28 pb-24 md:pt-36 md:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-32 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.2),transparent_66%)] blur-2xl"
        />
        <div className="u-container relative z-10">
          <Breadcrumbs trail={trail} dark />
          <div className="mt-7">
            <Badge variant="gold">Do consultório</Badge>
          </div>
          <h1 className="mt-5 max-w-4xl text-display text-bone-50">
            Artigos e casos clínicos sobre{" "}
            <span className="u-accent whitespace-nowrap text-gold-400">células-tronco</span> e
            longevidade
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-bone-100/70">
            Conhecimento para entender melhor sua saúde. São {artigos.length} textos do
            Dr. Tércio Rocha sobre casos reais, células-tronco e longevidade, com base
            científica e escritos para quem quer entender, não apenas seguir. Os nomes
            dos pacientes foram trocados para preservar a privacidade.
          </p>
        </div>
      </section>

      <BuscaArtigos artigos={itens} categorias={categorias} />

      <section className="pb-24 md:pb-32">
        <div className="u-container">
          <div className="u-grain u-grid-lines relative isolate overflow-hidden rounded-card bg-ink-900 p-10 text-center md:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.28),transparent_68%)]"
            />
            <h2 className="relative text-title text-bone-50">Seu caso pode ser o próximo</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-[1rem] leading-relaxed text-bone-100/70">
              As histórias aqui começaram com uma conversa. Conte a sua e a equipe
              retorna pelo WhatsApp.
            </p>
            <Button href="/consulta" variant="gold" className="relative mt-8">
              Quero ser paciente
            </Button>
          </div>
        </div>
      </section>

      <JsonLd data={graph(listaSchema, breadcrumbSchema(trail))} />
    </>
  );
}
