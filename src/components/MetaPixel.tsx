"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { META_PIXEL_ID, paginaSemPixel } from "@/lib/meta-pixel";

/**
 * Carrega o pixel da Meta depois que a página fica interativa e conta um PageView a cada troca de página
 * (o App Router não recarrega a página, então o pixel sozinho só veria a primeira).
 * A ficha da guia não carrega nem conta.
 */
export function MetaPixel() {
  const caminho = usePathname() ?? "/";
  const fora = paginaSemPixel(caminho);
  /* O primeiro PageView sai do próprio snippet, no init. */
  const iniciado = useRef(false);

  useEffect(() => {
    if (fora) return;
    if (!iniciado.current) {
      iniciado.current = true;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [caminho, fora]);

  if (fora && !iniciado.current) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
