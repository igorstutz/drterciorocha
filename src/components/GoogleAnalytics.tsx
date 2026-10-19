"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { GA_ID } from "@/lib/google-analytics";
import { paginaSemPixel } from "@/lib/meta-pixel";

/**
 * Carrega o GA4 depois que a página fica interativa. A visita inicial sai do `config`; as trocas de página do App
 * Router o GA4 mede sozinho pela "medição otimizada" (mudanças no histórico do navegador, ligada por padrão na
 * propriedade). Quem chega direto na ficha da guia não carrega o GA (o link traz o telefone no endereço); se a
 * pessoa sair dela para outra página, o GA carrega ali.
 */
export function GoogleAnalytics() {
  const caminho = usePathname() ?? "/";
  const carregou = useRef(false);
  if (paginaSemPixel(caminho) && !carregou.current) return null;
  carregou.current = true;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
