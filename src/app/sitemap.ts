import type { MetadataRoute } from "next";
import { site, indications } from "@/content/site";
import { getArtigos } from "@/lib/artigos";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  const estaticas: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/consulta`, lastModified: agora, changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/tratamentos`, lastModified: agora, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/dr-tercio-rocha`, lastModified: agora, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/ebook-longevidade`, lastModified: agora, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/artigos`, lastModified: agora, changeFrequency: "weekly", priority: 0.75 },
    { url: `${site.url}/livros`, lastModified: agora, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/perguntas-frequentes`, lastModified: agora, changeFrequency: "monthly", priority: 0.7 },
  ];

  const tratamentos: MetadataRoute.Sitemap = indications.map((i) => ({
    url: `${site.url}/tratamentos/${i.slug}`,
    lastModified: agora,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const artigos: MetadataRoute.Sitemap = getArtigos().map((a) => ({
    url: `${site.url}/artigos/${a.slug}`,
    lastModified: a.atualizado || a.publicado ? new Date(a.atualizado || a.publicado) : agora,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...estaticas, ...tratamentos, ...artigos];
}
