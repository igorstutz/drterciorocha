import type { NextConfig } from "next";
import artigos from "./src/content/artigos/artigos.json";

/**
 * Redirects 301 do WordPress antigo. Sem isso, toda autoridade acumulada nas
 * 54 URLs indexadas viraria 404 no dia da virada.
 *
 * Os artigos moram na raiz no site antigo (`/alopecia-nunca-mais/`) e passam a
 * viver sob `/artigos/`. O slug é preservado — muda só o prefixo.
 */
const redirectsArtigos = artigos.map((a) => ({
  source: `/${a.slug}`,
  destination: `/artigos/${a.slug}`,
  permanent: true,
}));

const redirectsPaginas = [
  { source: "/consulta-dr-tercio-rocha", destination: "/consulta", permanent: true },
  { source: "/e-book-longevidade-dr-tercio", destination: "/ebook-longevidade", permanent: true },
  { source: "/blog__dr_tercio_rocha_celulas_tronco", destination: "/artigos", permanent: true },
  { source: "/blog__dr_tercio_rocha_celulas_tronco/:page", destination: "/artigos", permanent: true },
  { source: "/category/celulas-tronco", destination: "/artigos", permanent: true },
  { source: "/category/medicina-com-foco-em-longevidade", destination: "/artigos", permanent: true },
  { source: "/category/medicinaregenerativa", destination: "/artigos", permanent: true },
  { source: "/category/:slug", destination: "/artigos", permanent: true },
  { source: "/author/:slug", destination: "/dr-tercio-rocha", permanent: true },
  { source: "/permita-se-longevitar-se", destination: "/artigos", permanent: true },
  { source: "/links", destination: "/", permanent: true },
  { source: "/linknabio", destination: "/", permanent: true },
  { source: "/pagina-exemplo", destination: "/", permanent: true },
  { source: "/gerar-guia", destination: "/consulta", permanent: true },
  { source: "/confirma-guia", destination: "/consulta", permanent: true },
  { source: "/confirmacao-dr-tercio", destination: "/consulta", permanent: true },
  /* Arquivos de data do WordPress (/2025/12/19/) não têm equivalente. */
  { source: "/:ano(\\d{4})/:mes(\\d{2})/:dia(\\d{2})", destination: "/artigos", permanent: true },
  { source: "/:ano(\\d{4})/:mes(\\d{2})", destination: "/artigos", permanent: true },
  /* Rotas internas do WordPress que não devem mais existir. */
  { source: "/wp-admin/:path*", destination: "/", permanent: true },
  { source: "/feed", destination: "/artigos", permanent: true },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "drterciorocha.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,

  async redirects() {
    return [...redirectsPaginas, ...redirectsArtigos];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        source: "/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
