import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { autores, AUTOR_PADRAO, getAutor } from "@/content/autores";
import { getArtigos } from "@/lib/artigos";
import { nomeDaCategoria } from "@/lib/slug";
import { site } from "@/content/site";
import { ArrowLink, Breadcrumbs, Eyebrow } from "@/components/ui";
import { JsonLd, graph, breadcrumbSchema } from "@/lib/jsonld";

/* Regenera a cada minuto: a página do colunista aparece quando o primeiro artigo dele entra no ar. */
export const revalidate = 60;

/** Os colunistas. O Dr. Tércio tem a própria página, /dr-tercio-rocha. */
export function generateStaticParams() {
  return autores.filter((a) => a.slug !== AUTOR_PADRAO).map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

function doAutor(slug: string) {
  const autor = autores.find((a) => a.slug === slug && a.slug !== AUTOR_PADRAO);
  if (!autor) return null;
  return { autor, artigos: getArtigos().filter((a) => getAutor(a.autor).slug === slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = doAutor(slug);
  if (!d) return {};
  return {
    title: `${d.autor.nome}, colunista`,
    description: d.autor.resumo,
    alternates: { canonical: d.autor.pagina },
  };
}

export default async function PaginaDoAutor({ params }: Props) {
  const { slug } = await params;
  const d = doAutor(slug);
  /* Sem artigo no ar, a página não existe: nada de página vazia indexada. */
  if (!d || d.artigos.length === 0) notFound();
  const { autor, artigos } = d;

  const trail = [
    { name: "Início", url: "/" },
    { name: "Artigos", url: "/artigos" },
    { name: autor.nome, url: autor.pagina },
  ];
  const pessoa = {
    "@type": "Person",
    "@id": `${site.url}${autor.pagina}#pessoa`,
    name: autor.nome,
    jobTitle: autor.titulo || undefined,
    description: autor.resumo,
    image: `${site.url}${autor.foto}`,
    url: `${site.url}${autor.pagina}`,
    sameAs: autor.redes?.map((r) => r.url),
  };

  return (
    <>
      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 pt-28 pb-16 md:pt-36 md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-32 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.2),transparent_66%)] blur-2xl"
        />
        <div className="u-container relative z-10">
          <Breadcrumbs trail={trail} dark />
          <div className="mt-9 flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            <Image
              src={autor.foto}
              alt={autor.nome}
              width={176}
              height={176}
              priority
              className="h-32 w-32 shrink-0 rounded-full object-cover ring-2 ring-gold-500/60 ring-offset-4 ring-offset-ink-900 md:h-44 md:w-44"
            />
            <div className="max-w-2xl">
              <Eyebrow tone="muted">Colunista</Eyebrow>
              <h1 className="mt-3 text-display text-bone-50">{autor.nome}</h1>
              {autor.titulo && <p className="mt-3 text-lead text-gold-300">{autor.titulo}</p>}
              {autor.redes && autor.redes.length > 0 && (
                <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.88rem]">
                  {autor.redes.map((r) => (
                    <a
                      key={r.url}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-bone-100/65 underline-offset-4 transition-colors hover:text-bone-50 hover:underline"
                    >
                      {r.rede}
                    </a>
                  ))}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {autor.bio && autor.bio.length > 0 && (
        <section className="u-container py-14 md:py-16">
          <div className="mx-auto max-w-[44rem] space-y-5 text-[1.05rem] leading-relaxed text-text-body">
            {autor.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      )}

      <section className="u-dots relative border-t border-ink-900/8 bg-bone-200/50 py-16 md:py-20">
        <div className="u-container">
          <Eyebrow>Artigos</Eyebrow>
          <h2 className="mt-4 text-title">
            Escritos por <span className="u-accent text-gold-700">{autor.nome}</span>
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {artigos.map((a) => (
              <Link
                key={a.slug}
                href={`/artigos/${a.slug}`}
                className="group flex flex-col overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 shadow-lift transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:border-gold-500/45 hover:shadow-lift-hover"
              >
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image
                    src={a.capaLocal}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 24rem, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-700">
                    {nomeDaCategoria(a.categoria)} · {a.leitura} min
                  </p>
                  <h3 className="mt-3 text-[1.12rem] leading-snug font-medium tracking-tight text-text-strong transition-colors group-hover:text-gold-700">
                    {a.titulo}
                  </h3>
                  <div className="mt-auto pt-5">
                    <ArrowLink>Ler artigo</ArrowLink>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={graph(pessoa, breadcrumbSchema(trail))} />
    </>
  );
}
